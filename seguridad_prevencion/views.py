from django.shortcuts import render, redirect, get_object_or_404
from .models import *
from .forms import *
from django.http import JsonResponse, HttpResponse
from datetime import datetime, timedelta
import io
import json
from web.views.views import *
from web.views.views_descargas import *
from django.db import transaction
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
import logging
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
from django.views import View

logger = logging.getLogger(__name__)

def certificados_prevencion(request):
    user = request.session.get('user')
    if not user:
        return redirect('/')

    numero_expediente = request.GET.get('numero_expediente', '')
    rif_empresarial = request.GET.get('rif_empresarial', '').strip()
    dependencia = request.GET.get('dependencia', '')
    page = request.GET.get('page', 1)
    
    # Consulta base - filtrar por dependencia si no es administrador
    if user['user'] == 'SeRvEr' or user['user'] == "Sala_Situacional":
        comercios_query = Comercio.objects.all().order_by('id_comercio')
    elif user['user'] == 'Prevencion05':
        # Asumimos que el modelo Comercio tiene un campo 'dependencia'
        comercios_query = Comercio.objects.filter(departamento = 'San Cristobal').order_by('id_comercio')
    
    # Aplicar filtros adicionales si existen
    if numero_expediente == "GET ALL":
        pass  # Mostrar todos sin filtro
    elif numero_expediente and numero_expediente != "GET ALL":
        comercios_query = comercios_query.filter(id_comercio__icontains=numero_expediente)
    elif rif_empresarial:
        comercios_query = comercios_query.filter(rif_empresarial__icontains=rif_empresarial)
    
    # Filtro adicional de dependencia para administradores
    if (user['user'] == 'SeRvEr' or user['user'] == 'Sala_Situacional') and dependencia:
        comercios_query = comercios_query.filter(departamento=dependencia)
    
    # Obtener el total de registros después de aplicar los filtros
    total_comercios = comercios_query.count()
    
    # Configurar paginación (25 registros por página)
    paginator = Paginator(comercios_query, 25)
    
    try:
        comercios = paginator.page(page)
    except PageNotAnInteger:
        comercios = paginator.page(1)
    except EmptyPage:
        comercios = paginator.page(paginator.num_pages)
    
    return render(request, "Seguridad-prevencion/solicitudes.html", {
        "user": user,
        "jerarquia": user["jerarquia"],
        "nombres": user["nombres"],
        "apellidos": user["apellidos"],
        "comercios": comercios,
        "conteo": total_comercios,
        "numero_expediente": numero_expediente,
        "rif_empresarial": rif_empresarial,
        "dependencia": dependencia,
    })


def formulario_certificado_prevencion(request):
    # Verificación de usuario y sesión
    user = request.session.get('user')
    if not user:
        logger.warning('Intento de acceso no autenticado a formulario_certificado_prevencion')
        return redirect('/')
    
    try:
        comercios = Comercio.objects.all()
        logger.debug(f'Obtenidos {len(comercios)} comercios para el formulario')
    except Exception as e:
        logger.error(f'Error al obtener comercios: {str(e)}')
        comercios = []
        messages.error(request, 'Error al cargar la lista de comercios')
    
    if request.method == 'POST':
        logger.info('Inicio de procesamiento de formulario POST')
        
        # Creamos una copia mutable del POST
        post_data = request.POST.copy()
        
        # Verificamos si el método de pago requiere referencia
        metodo_pago = post_data.get('metodo_pago', '')
        requiere_referencia = metodo_pago in ['Transferencia', 'Deposito']
        
        # Si no requiere referencia, eliminamos el campo del POST para evitar validación
        if not requiere_referencia:
            post_data['referencia'] = 'No Hay Referencia'
        
        solicitud_form = SolicitudForm(post_data)
        requisitos_form = RequisitosForm(post_data)
        
        if solicitud_form.is_valid() and requisitos_form.is_valid():
            try:
                # Guardamos la solicitud PRIMERO
                solicitud = solicitud_form.save(commit=False)
                
                # Validación adicional del comercio
                comercio_id = post_data.get('id_solicitud')
                if not comercio_id:
                    raise ValueError("Debe seleccionar un comercio válido")
                
                solicitud.id_solicitud_id = comercio_id
                solicitud.save()  # Guardamos para obtener el ID
                logger.info(f'Solicitud creada con ID: {solicitud.id}')
                
                # Ahora guardamos los requisitos ASOCIADOS a la solicitud
                requisitos = requisitos_form.save(commit=False)
                requisitos.id_solicitud = solicitud  # Asignamos la instancia completa
                requisitos.save()
                logger.info(f'Requisitos creados con ID: {requisitos.id} para solicitud {solicitud.id}')
                
                messages.success(request, 'Solicitud creada exitosamente!')
                return redirect('certificados_prevencion')
                
            except ValueError as ve:
                error_msg = f'Error de validación: {str(ve)}'
                logger.error(error_msg)
                messages.error(request, error_msg)
            except Exception as e:
                error_msg = f'Error al guardar la solicitud: {str(e)}'
                logger.error(error_msg, exc_info=True)
                messages.error(request, 'Ocurrió un error al procesar tu solicitud')
                
                # Guardamos los datos del formulario en la sesión para recuperarlos
                request.session['comercio_form_data'] = {
                    'solicitud_form_data': request.POST,  # Usamos el POST original aquí
                    'requisitos_form_data': request.POST
                }
                return redirect(request.path)
        else:
            # Procesar errores de validación
            for field, errors in solicitud_form.errors.items():
                for error in errors:
                    # Omitimos el error de referencia si no es requerido
                    if field != 'referencia' or requiere_referencia:
                        messages.error(request, f"{field}: {error}")
            
            for field, errors in requisitos_form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
            
            request.session['comercio_form_data'] = request.POST  # POST original
            return redirect(request.path)
    
    # Manejo del GET (mostrar formulario)
    context = {
        "user": user,
        "jerarquia": user["jerarquia"],
        "nombres": user["nombres"],
        "apellidos": user["apellidos"],
        "comercio_form": ComercioForm(),
        "comercios": comercios,
        "solicitud_form": SolicitudForm(request.session.pop('comercio_form_data', None)),
        "requisitos_form": RequisitosForm(request.session.pop('comercio_form_data', None)),
    }
    
    return render(request, 'Seguridad-prevencion/formularioSolicitud.html', context)


# def planilla_certificado(request):
#     user = request.session.get('user')
#     if not user:
#             return redirect('/')

#     return render(request, "Seguridad-prevencion/planillaCertificadoDeConformidad.html", {
#         "user": user,
#         "jerarquia": user["jerarquia"],
#         "nombres": user["nombres"],
#         "apellidos": user["apellidos"],
#     })


def obtener_ultimo_reporte_solicitudes(request):
    ultimo = Solicitudes.objects.select_related('id_solicitud').order_by('-id').first()

    if not ultimo:
        return JsonResponse({'error': 'No existen reportes aún'}, status=404)

    data = {
        'id': ultimo.id,
        'fecha_solicitud': ultimo.fecha_solicitud,
        'hora_solicitud': ultimo.hora_solicitud,
        'tipo_servicio': ultimo.tipo_servicio,
        'solicitante': ultimo.solicitante_nombre_apellido,
        'comercio': ultimo.id_solicitud.nombre_comercio,
        'id_comercio': ultimo.id_solicitud.id_comercio,
    }

    return JsonResponse(data)


def api_get_solicitudes(request, referencia):
    try:
        solicitudes = Solicitudes.objects.filter(
            id_solicitud__id_comercio=referencia
        ).select_related('id_solicitud').prefetch_related('requisitos_set')
        
        hoy = datetime.today().date()
        proximo_mes = hoy + timedelta(days=30)
        
        data = []
        for solicitud in solicitudes:
            requisito = solicitud.requisitos_set.first()
            
            # Documentos faltantes
            documentos_faltantes = []
            if not requisito:
                documentos_faltantes = ["No hay requisitos registrados"]
            else:
                campos_faltantes = [
                    ('Cédula de identidad', requisito.cedula_identidad),
                    ('RIF del representante', requisito.rif_representante),
                    ('RIF del comercio', requisito.rif_comercio),
                    ('Permiso anterior', requisito.permiso_anterior),
                    ('Registro de comercio', requisito.registro_comercio),
                    ('Documento de propiedad', requisito.documento_propiedad),
                    ('Cédula catastral', requisito.cedula_catastral),
                    ('Carta de autorización', requisito.carta_autorizacion),
                    ('Plano bomberil', requisito.plano_bomberil)
                ]
                documentos_faltantes = [nombre for nombre, existe in campos_faltantes if not existe]

            # Documentos con vencimiento
            documentos_vencimiento = []
            documentos_prox_vencer = []
            
            if requisito:
                vencimientos = [
                    ('Cédula de identidad', requisito.cedula_vencimiento),
                    ('RIF del representante', requisito.rif_representante_vencimiento),
                    ('RIF del comercio', requisito.rif_comercio_vencimiento),
                    ('Documento de propiedad', requisito.documento_propiedad_vencimiento),
                    ('Cédula catastral', requisito.cedula_catastral_vencimiento)
                ]
                
                for nombre, fecha in vencimientos:
                    if fecha:
                        if fecha < hoy:
                            documentos_vencimiento.append(f"{nombre} (venció el {fecha.strftime('%d/%m/%Y')}")
                        elif fecha <= proximo_mes:
                            documentos_prox_vencer.append(f"{nombre} (vence el {fecha.strftime('%d/%m/%Y')}")

            data.append({
                "id": solicitud.id_solicitud.id_comercio,
                "id_solicitud": solicitud.id,
                "comercio_departamento": solicitud.id_solicitud.departamento, 
                "fecha": solicitud.fecha_solicitud.strftime('%d/%m/%Y'),
                "solicitante": solicitud.solicitante_nombre_apellido,
                "tipo_solicitud": solicitud.tipo_servicio,
                "documentos_faltantes": documentos_faltantes or ["Todos los documentos están en orden"],
                "documentos_proximos_vencer": documentos_prox_vencer or ["No hay documentos próximos a vencer"],
                "documentos_vencidos": documentos_vencimiento or ["No hay documentos vencidos"],
                "tiene_requisitos": requisito is not None
            })
            
        return JsonResponse(data, safe=False)
    
    except Exception as e:
        logger.error(f"Error en api_get_solicitudes: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)




class DocumentGenerator:
    """Clase base para generación de documentos PDF con soporte para múltiples dependencias"""
    
    TEMPLATES = {
        'San Cristobal': {
            'solicitud': 'web/static/assets/Solictud_2025.pdf',
            'inspeccion': 'web/static/assets/Inspeccion_2025.pdf'
        },
        'Junin': {
            'solicitud': 'web/static/assets/Documentos Junin/Solictud_2025 (junin).pdf',
            'inspeccion': 'web/static/assets/Documentos Junin/Inspeccion_2025 (junin).pdf'
        },
        'default': {
            'solicitud': 'web/static/assets/Solictud.pdf',
            'inspeccion': 'web/static/assets/Inspeccion.pdf'
        }
    }
    
    def __init__(self, solicitud_id, dependencia=None):
        self.solicitud = get_object_or_404(Solicitudes, id=solicitud_id)
        self.datos_comercio = get_object_or_404(
            Comercio, 
            id_comercio=self.solicitud.id_solicitud.id_comercio
        )
        self.dependencia = dependencia or self.datos_comercio.departamento
        self.template_path = self.get_template_path()
    
    def get_template_path(self):
        """Obtiene la ruta de la plantilla según la dependencia"""
        template_type = self.get_template_type()
        return self.TEMPLATES.get(self.dependencia, self.TEMPLATES['default'])[template_type]
    
    def get_template_type(self):
        """Método abstracto para definir el tipo de plantilla"""
        raise NotImplementedError("Debe implementarse en las clases hijas")
    
    def get_document_data(self):
        """Obtiene los datos comunes para todos los documentos"""
        return {
            "ID_Comercio": str(self.datos_comercio.id_comercio),
            "Fecha_Solicitud": str(self.solicitud.fecha_solicitud),
            "Hora": str(self.solicitud.hora_solicitud),
            "Tipo_Servicio": str(self.solicitud.tipo_servicio),
            "Solicitante": str(self.solicitud.solicitante_nombre_apellido),
            "CI": str(self.solicitud.solicitante_cedula),
            "Tipo_Representante": str(self.solicitud.tipo_representante),
            "Nombre_Comercio": str(self.datos_comercio.nombre_comercio),
            "Rif_Empresarial": str(self.datos_comercio.rif_empresarial),
            "Rif_Representante_Legal": str(self.solicitud.rif_representante_legal),
            "Direccion": str(self.solicitud.direccion),
            "Estado": str(self.solicitud.estado),
            "Municipio": str(self.solicitud.municipio),
            "Parroquia": str(self.solicitud.parroquia),
            "Telefono": str(self.solicitud.numero_telefono),
            "Correo_Electronico": str(self.solicitud.correo_electronico),
            "Pago_Tasa_Servicio": str(self.solicitud.pago_tasa),
            "Metodo_Pago": str(self.solicitud.metodo_pago),
            "Referencia": str(self.solicitud.referencia),
        }
    
    def fill_pdf_template(self, additional_data=None):
        """Rellena la plantilla PDF con los datos"""
        doc = fitz.open(self.template_path)
        data = self.get_document_data()
        
        if additional_data:
            data.update(additional_data)
        
        for page in doc:
            for campo, valor in data.items():
                search_str = f"{{{{{campo}}}}}"
                text_instances = page.search_for(search_str)
                
                for inst in text_instances:
                    x, y, x1, y1 = inst
                    y_adjusted = y + 7.5  # Ajuste de posición vertical
                    
                    # Borrar texto anterior
                    rect = fitz.Rect(x, y, x1, y1)
                    page.draw_rect(rect, color=(1, 1, 1), fill=(1, 1, 1))
                    
                    # Insertar nuevo texto
                    page.insert_text(
                        point=(x, y_adjusted),
                        text=valor,
                        fontsize=8,
                        color=(0, 0, 0)
                    )
        
        return doc
    
    def generate_response(self):
        """Genera la respuesta HTTP con el PDF"""
        doc = self.fill_pdf_template()
        buffer = io.BytesIO()
        doc.save(buffer)
        doc.close()
        buffer.seek(0)
        
        response = HttpResponse(buffer, content_type="application/pdf")
        response["Content-Disposition"] = f'inline; filename="{self.get_output_filename()}"'
        return response
    
    def get_output_filename(self):
        """Método abstracto para definir el nombre del archivo de salida"""
        raise NotImplementedError("Debe implementarse en las clases hijas")

class GuiaDocumentGenerator(DocumentGenerator):
    """Generador específico para documentos de Guía"""
    
    def get_template_type(self):
        return 'solicitud'
    
    def get_output_filename(self):
        return f"Guia_Solicitud_{self.solicitud.id}.pdf"
    
    def get_document_data(self):
        base_data = super().get_document_data()
        requisitos = get_object_or_404(Requisitos, id_solicitud=self.solicitud.id)
        
        # Datos adicionales específicos para la Guía
        additional_data = {
            "Status_Cedula": "Completado" if requisitos.cedula_identidad else "Incompleto",
            "Status_Rif": "Completado" if requisitos.rif_representante else "Incompleto",
            "Status_Comercio": "Completado" if requisitos.rif_comercio else "Incompleto",
            "Status_Permiso": "Completado" if requisitos.permiso_anterior else "Incompleto",
            "Status_Registro_Comercio": "Completado" if requisitos.registro_comercio else "Incompleto",
            "Status_Documento_Propiedad": "Completado" if requisitos.documento_propiedad else "Incompleto",
            "Status_Cedula_Catastral": "Completado" if requisitos.cedula_catastral else "Incompleto",
            "Status_Carta_Autorizacion": "Completado" if requisitos.carta_autorizacion else "Incompleto",
            "Status_Plano": "Completado" if requisitos.plano_bomberil else "Incompleto",
        }
        
        base_data.update(additional_data)
        return base_data

class InspeccionDocumentGenerator(DocumentGenerator):
    """Generador específico para documentos de Inspección"""
    
    def get_template_type(self):
        return 'inspeccion'
    
    def get_output_filename(self):
        return f"Solicitud_inspeccion_{self.solicitud.id}.pdf"

# Vistas
def doc_Guia(request, id):
    dependencia = request.GET.get('dependencia')
    generator = GuiaDocumentGenerator(id, dependencia)
    return generator.generate_response()

def doc_Inspeccion(request, id):
    dependencia = request.GET.get('dependencia')
    generator = InspeccionDocumentGenerator(id, dependencia)
    return generator.generate_response()





def api_eliminar_solicitudes(request, id):
    solicitud = get_object_or_404(Solicitudes, id=id)
    solicitud.delete()
    return JsonResponse({
        "message": "Solicitud eliminada correctamente",
        "status": "success"
    }, status=200)


def validar_cedula(request):
    cedula = request.GET.get("cedula", "").strip()
    comercio_id = request.GET.get("comercio", "").strip()  # Obtener comercio enviado desde el frontend


    if not cedula or not cedula.startswith(("V-", "E-")):
        return JsonResponse({"error": "Formato inválido. Use V-12345678 o E-12345678."}, status=400)

    # Obtener los comercios asociados a la cédula
    solicitudes = Solicitudes.objects.filter(solicitante_cedula=cedula)
    comercios_asociados = set(solicitudes.values_list("id_solicitud__id_comercio", flat=True))
    cantidad_comercios = len(comercios_asociados)

    # Si la cédula ya está en 3 comercios y el comercio actual no está en la lista, bloquear registro
    if cantidad_comercios >= 3 and comercio_id not in comercios_asociados:
        return JsonResponse({
            "existe": True,
            "cantidad_comercios": cantidad_comercios,
            "valido": False,  # Bloquear el registro
            "mensaje": "❌ La cédula ya está asociada a 3 comercios distintos."
        })

    return JsonResponse({
        "existe": cantidad_comercios > 0,
        "cantidad_comercios": cantidad_comercios,
        "valido": True  # Permitir el registro
    })


def editar_solicitud(request, id):
    user = request.session.get('user')
    if not user:
        return redirect('/')

    # Obtener los objetos necesarios
    solicitud = get_object_or_404(Solicitudes, id=id)
    datos_solicitud = get_object_or_404(Comercio, id_comercio=solicitud.id_solicitud.id_comercio)
    requisitos = get_object_or_404(Requisitos, id_solicitud=solicitud.id)
    
    if request.method == 'POST':
        # Procesar el formulario enviado
        form = SolicitudForm(request.POST, instance=solicitud)
        requisitos_form = RequisitosForm(request.POST, instance=requisitos)
        
        if form.is_valid() and requisitos_form.is_valid():
            form.save()
            requisitos_form.save()
            messages.success(request, 'Solicitud actualizada correctamente')
            return redirect('certificados_prevencion')
    else:
        # Mostrar formulario con datos iniciales
        form = SolicitudForm(instance=solicitud)
        requisitos_form = RequisitosForm(instance=requisitos)
    
    # Contexto para la plantilla
    context = {
        "user": user,
        "jerarquia": user["jerarquia"],
        "nombres": user["nombres"],
        "apellidos": user["apellidos"],
        'form': form,
        'requisitos_form': requisitos_form,
        'comercio': datos_solicitud,
        'editing': True,
        'solicitud_id': id
    }
    
    return render(request, 'Seguridad-prevencion/editar_solicitud.html', context)


def agregar_comercio(request):
    if request.method == "POST":
        comercio = request.POST.get("nombre_comercio")
        rif_empresarial = request.POST.get("rif_empresarial").strip()
        departamento = request.POST.get("departamento", "")

        # Validar si el RIF ya existe
        if Comercio.objects.filter(rif_empresarial=rif_empresarial).exists():
            messages.error(request, "Este RIF ya está registrado en el sistema.")
            
            # Guardar los datos del formulario en la sesión
            request.session['comercio_form_data'] = {
                'nombre_comercio': comercio,
                'rif_empresarial': rif_empresarial,
                'departamento': departamento
            }
            
            return redirect(f"/seguridad_prevencion/formulariocertificados/?rif_error=true")

        # Guardar en la base de datos si no existe
        nuevo_comercio = Comercio.objects.create(
            nombre_comercio=comercio,
            rif_empresarial=rif_empresarial,
            departamento=departamento
        )

        # Limpiar datos de sesión si existían
        if 'comercio_form_data' in request.session:
            del request.session['comercio_form_data']

        return redirect(f"/seguridad_prevencion/formulariocertificados/?comercio_id={nuevo_comercio.id_comercio}")

    return HttpResponse("Método no permitido", status=405)


def generar_excel_solicitudes(request):
    print("=== INICIO DE generar_excel_solicitudes ===")
    
    user = request.session.get('user')
    print(f"Datos de usuario en sesión: {user}")
    
    if not user:
        print("Redireccionando: No hay usuario en sesión")
        return JsonResponse({'error': 'No autenticado'}, status=401)
    
    # Obtener parámetros de filtro
    fecha_inicio = request.GET.get('fecha_inicio')
    fecha_fin = request.GET.get('fecha_fin')
    solo_ultimos = request.GET.get('solo_ultimos', 'true').lower() == 'true'
    page = int(request.GET.get('page', 1))
    page_size = int(request.GET.get('page_size', 500))
    departamento_filtro = request.GET.get('departamento', '').strip()
    print(f"Valor recibido de departamento: '{departamento_filtro}'")  # Debe mostrar 'Junin'
    
    print(f"Parámetros recibidos - fecha_inicio: {fecha_inicio}, fecha_fin: {fecha_fin}, solo_ultimos: {solo_ultimos}, departamento: {departamento_filtro}")
    
    # Determinar departamentos permitidos según el usuario
    username = user.get('user', '')
    print(f"Username obtenido: {username}")
    
    if username in ['SeRvEr', 'Sala_Situacional']:
        print("Usuario identificado como Admin/Sala_Situacional")
        if departamento_filtro:
            departamentos_permitidos = [departamento_filtro]
        else:
            departamentos_permitidos = ['Junin', 'San Cristobal']
    elif username == 'Prevencion05':
        print("Usuario identificado como Prevencion05")
        departamentos_permitidos = ['San Cristobal']
    elif username == 'Junin':
        print("Usuario identificado como Junin")
        departamentos_permitidos = ['Junin']
    else:
        print(f"Usuario no reconocido: {username}. Devolviendo lista vacía")
        return JsonResponse([], safe=False)

    print(f"Departamentos permitidos: {departamentos_permitidos}")

    # Construir consulta base
    queryset = Solicitudes.objects.select_related(
        'id_solicitud', 'municipio', 'parroquia'
    ).filter(
        id_solicitud__departamento__in=departamentos_permitidos
    ).order_by('-fecha_solicitud')

    print(f"Total registros inicial: {queryset.count()}")

    # Aplicar filtros de fecha si existen
    if fecha_inicio:
        try:
            fecha_inicio = datetime.strptime(fecha_inicio, '%Y-%m-%d').date()
            queryset = queryset.filter(fecha_solicitud__gte=fecha_inicio)
            print(f"Filtro fecha_inicio aplicado: {fecha_inicio}")
        except ValueError:
            print("Formato de fecha inicio inválido")

    if fecha_fin:
        try:
            fecha_fin = datetime.strptime(fecha_fin, '%Y-%m-%d').date()
            queryset = queryset.filter(fecha_solicitud__lte=fecha_fin)
            print(f"Filtro fecha_fin aplicado: {fecha_fin}")
        except ValueError:
            print("Formato de fecha fin inválido")

    print(f"Total registros después de filtros fecha: {queryset.count()}")

    # Manejar diferentes modos de exportación
    if solo_ultimos:
        print("Modo: Solo últimas solicitudes")
        # Obtener solo la última solicitud por comercio
        subquery = Solicitudes.objects.filter(
            id_solicitud=models.OuterRef('id_solicitud')
        ).order_by('-fecha_solicitud').values('id')[:1]

        queryset = queryset.filter(id__in=subquery)
    else:
        print("Modo: Todas las solicitudes")
        # Para exportar todo, usamos paginación
        paginator = Paginator(queryset, page_size)
        page_obj = paginator.get_page(page)
        queryset = page_obj.object_list

    print(f"Total registros final: {queryset.count()}")

    # Preparar datos
    data = []
    for solicitud in queryset:
        try:
            comercio = solicitud.id_solicitud
            data.append({
                'ID Comercio': comercio.id_comercio,
                'Nombre Comercio': comercio.nombre_comercio,
                'RIF Comercio': comercio.rif_empresarial,
                'Departamento': comercio.departamento,
                'Número de Teléfono': solicitud.numero_telefono,
                'Nombre y Apellido del Solicitante': solicitud.solicitante_nombre_apellido,
                'Fecha de Solicitud': solicitud.fecha_solicitud.strftime('%Y-%m-%d') if solicitud.fecha_solicitud else None,
                'Dirección': solicitud.direccion,
                'Estado': solicitud.estado,
                'Municipio': solicitud.municipio.municipio if solicitud.municipio else 'N/A',
                'Parroquia': solicitud.parroquia.parroquia if solicitud.parroquia else 'N/A',
            })
        except Exception as e:
            print(f"Error procesando solicitud {solicitud.id}: {str(e)}")
            continue

    print(f"Total de registros a exportar: {len(data)}")
    print("=== FIN DE generar_excel_solicitudes ===")
    
    return JsonResponse(data, safe=False)


