from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.core.paginator import Paginator
from django.db.models import Prefetch, Max
from .forms import *
from .models import *
from web.models import Divisiones
from django.http import JsonResponse
from django.http import HttpResponse
from django.contrib import messages
from django.utils import timezone
from collections import Counter
from django.utils.timezone import now, localdate
from datetime import timedelta, date
from django.forms.models import model_to_dict
from django.views.decorators.http import require_http_methods
import pandas as pd
import json
from django.db.models import Q, Count, F
from django.db import transaction

# ========================= Dashboard Mecanica ========================
def Dashboard_mecanica(request):
    user = request.session.get('user')

    if not user:
        return redirect('/')
    # Renderizar la página con los datos
    return render(request, "mecanica/dashboard_mecanica.html", {
        "user": user,
        "jerarquia": user["jerarquia"],
        "nombres": user["nombres"],
        "apellidos": user["apellidos"],
    })

# ======================== Unidades ========================
def View_Unidades(request):
    user = request.session.get('user')
    if not user:
            return redirect('/')
    
    datos = []

    data = Unidades.objects.exclude(id__in=[26, 30, 27]).prefetch_related(
        Prefetch("unidades_detalles_set", to_attr="data_unidad"),
        Prefetch("id_division", to_attr="divisiones")  # Obtiene las divisiones asociadas
    ).order_by("id")

    conteo = data.count()

    for unidad in data:
        datos.append({
            "nombre_unidad": unidad.nombre_unidad,
            "id_unidad": unidad.id,
            "divisiones": [div.division for div in unidad.divisiones],  # Lista de nombres de divisiones
            "detalles": [
                {
                    "estado": detalle.estado,  # Reemplaza con los campos reales
                }
                for detalle in unidad.data_unidad  # Accede a los detalles prefetchados
            ]
        })


    return render(request, "unidades/unidades_inicio.html", {
        "user": user,
        "jerarquia": user["jerarquia"],
        "nombres": user["nombres"],
        "apellidos": user["apellidos"],
        "datos": datos,
        "form_reportes": Reportes(),
        "form_estado": Cambiar_Estado(),
        "form_division": Cambiar_Division(),
        "conteo": conteo,
    })

def View_Form_unidades(request):
    user = request.session.get('user')
    if not user:
            return redirect('/')

    return render(request, "unidades/unidades_form.html", {
        "user": user,
        "jerarquia": user["jerarquia"],
        "nombres": user["nombres"],
        "apellidos": user["apellidos"],
        "agregar_unidades": Unidades_Informacion(),
    })

def agregar_unidades(request):
    if request.method == "POST":
        unidad_id = request.POST.get("id_unidad")  # Si existe, se edita; si no, se crea
        nombre_unidad = request.POST.get("nombre_unidad")
        division_ids = request.POST.getlist("division")  # Obtener múltiples valores
        tipo_vehiculo = request.POST.get("tipo_vehiculo")
        serial_carroceria = request.POST.get("serial_carroceria")
        serial_chasis = request.POST.get("serial_chasis")
        marca = request.POST.get("marca")
        año = request.POST.get("año")
        modelo = request.POST.get("modelo")
        placas = request.POST.get("placas")
        tipo_filtro_aceite = request.POST.get("tipo_filtro_aceite")
        tipo_filtro_combustible = request.POST.get("tipo_filtro_combustible")
        bateria = request.POST.get("bateria")
        numero_tag = request.POST.get("numero_tag")
        tipo_bujia = request.POST.get("tipo_bujia")
        uso = request.POST.get("uso")
        capacidad_carga = request.POST.get("capacidad_carga")
        numero_ejes = request.POST.get("numero_ejes")
        numero_puestos = request.POST.get("numero_puestos")
        tipo_combustible = request.POST.get("tipo_combustible")
        tipo_aceite = request.POST.get("tipo_aceite")
        medida_neumaticos = request.POST.get("medida_neumaticos")
        tipo_correa = request.POST.get("tipo_correa")
        estado = request.POST.get("estado")

        # Si unidad_id existe, buscar la unidad para editarla; si no, crear una nueva
        if unidad_id:
            unidad = get_object_or_404(Unidades, id=unidad_id)
            unidad.nombre_unidad = nombre_unidad
            unidad.save()
        else:
            unidad = Unidades.objects.create(nombre_unidad=nombre_unidad)

        # Asignar divisiones a la unidad
        if division_ids:
            divisiones_seleccionadas = Divisiones.objects.filter(id__in=division_ids)
            unidad.id_division.set(divisiones_seleccionadas)

        # Buscar si la unidad ya tiene detalles
        detalles, created = Unidades_Detalles.objects.get_or_create(id_unidad=unidad)

        # Actualizar o asignar detalles
        detalles.tipo_vehiculo = tipo_vehiculo
        detalles.serial_carroceria = serial_carroceria
        detalles.serial_chasis = serial_chasis
        detalles.marca = marca
        detalles.año = año
        detalles.modelo = modelo
        detalles.placas = placas
        detalles.tipo_filtro_aceite = tipo_filtro_aceite
        detalles.tipo_filtro_combustible = tipo_filtro_combustible
        detalles.bateria = bateria
        detalles.numero_tag = numero_tag
        detalles.tipo_bujia = tipo_bujia
        detalles.uso = uso
        detalles.capacidad_carga = capacidad_carga
        detalles.numero_ejes = numero_ejes
        detalles.numero_puestos = numero_puestos
        detalles.tipo_combustible = tipo_combustible
        detalles.tipo_aceite = tipo_aceite
        detalles.medida_neumaticos = medida_neumaticos
        detalles.tipo_correa = tipo_correa
        detalles.estado = estado
        detalles.save()

        return redirect("/mecanica/unidades/")

def agregar_reportes(request):
    if request.method == "POST":
        unidad = request.POST.get("id_unidad")
        servicio = request.POST.get("servicio")
        fecha = request.POST.get("fecha")
        hora = request.POST.get("hora")
        responsable = request.POST.get("responsable")
        descripcion = request.POST.get("descripcion")


        unidad_instance = get_object_or_404(Unidades, id=unidad)
        servicio_instance = get_object_or_404(Servicios, id=servicio)

        Reportes_Unidades.objects.create(
            id_unidad = unidad_instance,
            servicio = servicio_instance,
            fecha = fecha,
            hora = hora,
            descripcion = descripcion,
            persona_responsable = responsable
        )

        return redirect("/mecanica/unidades/")
        # return redirect(f"/formulariocertificados/?comercio_id={nuevo_comercio.id_comercio}")

    return HttpResponse("Método no permitido", status=405)

def cambiar_estado(request):
    if request.method == "POST":
        unidad = request.POST.get("id_unidad-status")
    
        unidad_instance = get_object_or_404(Unidades, id=unidad)
        unidad_detalles = get_object_or_404(Unidades_Detalles, id_unidad=unidad_instance.id)

        unidad_detalles.estado = request.POST.get("nuevo")
        unidad_detalles.save()

        return redirect("/mecanica/unidades/")
        # return redirect(f"/formulariocertificados/?comercio_id={nuevo_comercio.id_comercio}")

    return HttpResponse("Método no permitido", status=405)

def reasignar_division(request):
    if request.method == "POST":
        unidad = request.POST.get("id_unidad-division")
        # nueva_division = request.POST.get("nuevo")
    
        # Obtener la unidad que queremos actualizar
        unidad_instance = get_object_or_404(Unidades, id=unidad)

        # Obtener la lista de divisiones seleccionadas en el formulario
        divisiones_ids = request.POST.getlist("nuevo")  # Lista de IDs

        # Obtener los objetos Divisiones basados en los IDs
        nuevas_divisiones = Divisiones.objects.filter(id__in=divisiones_ids)

        # Asignar las divisiones a la unidad
        unidad_instance.id_division.set(nuevas_divisiones)  # Reemplaza las anteriores

        # # Guardar la unidad con las nuevas divisiones asignadas
        unidad_instance.save()

        return redirect("/mecanica/unidades/")
        # return redirect(f"/formulariocertificados/?comercio_id={nuevo_comercio.id_comercio}")

    return HttpResponse("Método no permitido", status=405)

def obtener_info_unidad(request, id):
    unidad = get_object_or_404(Unidades, id=id)
    detalles = Unidades_Detalles.objects.filter(id_unidad=unidad).first()  # Obtener detalles si existen

    datos = {
        "id": unidad.id,
        "nombre_unidad": unidad.nombre_unidad,
        "divisiones": list(unidad.id_division.values("id", "division")),
        "tipo_vehiculo": detalles.tipo_vehiculo if detalles else "",
        "serial_carroceria": detalles.serial_carroceria if detalles else "",
        "serial_chasis": detalles.serial_chasis if detalles else "",
        "marca": detalles.marca if detalles else "",
        "año": detalles.año if detalles else "",
        "modelo": detalles.modelo if detalles else "",
        "placas": detalles.placas if detalles else "",
        "tipo_filtro_aceite": detalles.tipo_filtro_aceite if detalles else "",
        "tipo_filtro_combustible": detalles.tipo_filtro_combustible if detalles else "",
        "bateria": detalles.bateria if detalles else "",
        "numero_tag": detalles.numero_tag if detalles else "",
        "tipo_bujia": detalles.tipo_bujia if detalles else "",
        "uso": detalles.uso if detalles else "",
        "capacidad_carga": detalles.capacidad_carga if detalles else "",
        "numero_ejes": detalles.numero_ejes if detalles else "",
        "numero_puestos": detalles.numero_puestos if detalles else "",
        "tipo_combustible": detalles.tipo_combustible if detalles else "",
        "tipo_aceite": detalles.tipo_aceite if detalles else "",
        "medida_neumaticos": detalles.medida_neumaticos if detalles else "",
        "tipo_correa": detalles.tipo_correa if detalles else "",
        "estado": detalles.estado if detalles else "",
    }

    return JsonResponse(datos, safe=False)

def mostrar_informacion(request, id):
    # Obtener la unidad y sus detalles
    unidad = get_object_or_404(Unidades, id=id)
    detalles = get_object_or_404(Unidades_Detalles, id_unidad=unidad)

    # Obtener los últimos reportes de cada servicio asociado a la unidad
    ultimos_reportes = (
        Reportes_Unidades.objects
        .filter(id_unidad=unidad)
        .values("servicio")  # Agrupamos por servicio
        .annotate(ultima_fecha=Max("fecha"))  # Obtenemos la última fecha de cada servicio
    )

    # Ahora, obtenemos el reporte más reciente para cada servicio con la fecha obtenida
    reportes_finales = []
    for reporte in ultimos_reportes:
        ultimo_reporte = Reportes_Unidades.objects.filter(
            id_unidad=unidad,
            servicio=reporte["servicio"],
            fecha=reporte["ultima_fecha"]
        ).order_by("-hora").first()  # Si hay más de uno en la misma fecha, toma el más reciente por hora

        if ultimo_reporte:
            reportes_finales.append({
                "servicio": ultimo_reporte.servicio.nombre_servicio,
                "fecha": ultimo_reporte.fecha.strftime("%Y-%m-%d"),
                "hora": ultimo_reporte.hora.strftime("%H:%M"),
                "descripcion": ultimo_reporte.descripcion,
                "persona_responsable": ultimo_reporte.persona_responsable,
            })

    # Crear la estructura de datos para la respuesta JSON
    datos = {
        "id": unidad.id,
        "nombre_unidad": unidad.nombre_unidad,
        "divisiones": list(unidad.id_division.values("id", "division")),
        "tipo_vehiculo": detalles.tipo_vehiculo,
        "serial_carroceria": detalles.serial_carroceria,
        "serial_chasis": detalles.serial_chasis,
        "marca": detalles.marca,
        "año": detalles.año,
        "modelo": detalles.modelo,
        "placas": detalles.placas,
        "tipo_filtro_aceite": detalles.tipo_filtro_aceite,
        "tipo_filtro_combustible": detalles.tipo_filtro_combustible,
        "bateria": detalles.bateria,
        "numero_tag": detalles.numero_tag,
        "tipo_bujia": detalles.tipo_bujia,
        "uso": detalles.uso,
        "capacidad_carga": detalles.capacidad_carga,
        "numero_ejes": detalles.numero_ejes,
        "numero_puestos": detalles.numero_puestos,
        "tipo_combustible": detalles.tipo_combustible,
        "tipo_aceite": detalles.tipo_aceite,
        "medida_neumaticos": detalles.medida_neumaticos,
        "tipo_correa": detalles.tipo_correa,
        "estado": detalles.estado,
        "ultimos_reportes": reportes_finales  # Se agrega la lista de reportes al JSON final
    }

    return JsonResponse(datos, safe=False)



# ========================== Herramientas e Inventario =========================

# 1- Gestion Herramientas
def listar_herramientas(request):
    user = request.session.get('user')
    if not user:
        return redirect('/')
    
    # Búsqueda y filtrado
    query = request.GET.get('q', '')
    categoria = request.GET.get('categoria', '')

    categorias = CategoriaHerramienta.objects.all().order_by('nombre')
    
    herramientas = Herramienta.objects.annotate(
        asignadas=Count('asignaciones', filter=Q(asignaciones__fecha_devolucion__isnull=True))
    ).order_by('nombre')
    
    if query:
        herramientas = herramientas.filter(
            Q(nombre__icontains=query) | 
            Q(numero_serie__icontains=query) |
            Q(modelo__icontains=query)
        )
    
    if categoria:
        herramientas = herramientas.filter(categoria=categoria)

    return render(request, 'inventario_herramientas/listar_herramientas.html', {
        'herramientas': herramientas,
        'user': user,
        'jerarquia': user['jerarquia'],
        'nombres': user['nombres'],
        'apellidos': user['apellidos'],
        'query': query,
        'categorias': categorias,
        'categoria_seleccionada': int(categoria) if categoria else None
    })


def crear_herramienta(request):
    user = request.session.get('user')
    if not user:
        return redirect('/')
    
    if request.method == 'POST':
        form = HerramientaForm(request.POST, request.FILES)
        if form.is_valid():
            herramienta = form.save()
            messages.success(request, f'Herramienta {herramienta.nombre} creada correctamente')
            return redirect('listar-herramientas')
    else:
        form = HerramientaForm()

    return render(request, 'inventario_herramientas/formulario_herramientas.html', {
        'form': form,
        'titulo': 'Nueva Herramienta',
        'user': user,
        'jerarquia': user['jerarquia'],
        'nombres': user['nombres'],
        'apellidos': user['apellidos'],
    })


def editar_herramienta(request, pk):
    user = request.session.get('user')
    if not user:
        return redirect('/')
    
    herramienta = get_object_or_404(Herramienta, pk=pk)
    
    if request.method == 'POST':
        form = HerramientaForm(request.POST, request.FILES, instance=herramienta)
        if form.is_valid():
            herramienta = form.save()
            messages.success(request, f'Herramienta {herramienta.nombre} actualizada')
            return redirect('listar-herramientas')
    else:
        form = HerramientaForm(instance=herramienta)

    return render(request, 'inventario_herramientas/formulario_herramientas.html', {
        'form': form,
        'user': user,
        'titulo': 'Editar Herramienta',
        'jerarquia': user['jerarquia'],
        'nombres': user['nombres'],
        'apellidos': user['apellidos'],
    })


def eliminar_herramienta(request, pk):
    user = request.session.get('user')
    if not user:
        return redirect('/')
    
    herramienta = get_object_or_404(Herramienta, pk=pk)
    
    if request.method == 'POST':
        nombre = herramienta.nombre
        herramienta.delete()
        messages.success(request, f'Herramienta {nombre} eliminada')
        return redirect('listar-herramientas')

    return render(request, 'inventario_herramientas/eliminar_herramienta.html', {
        'herramienta': herramienta,
        'user': user,
        'jerarquia': user['jerarquia'],
        'nombres': user['nombres'],
        'apellidos': user['apellidos'],
    })



# 2- Asignacion Herramientas ===============================
def asignacion_unidades(request):
    user = request.session.get('user')
    if not user:
        return redirect('/')

    unidades = Unidades.objects.exclude(id__in=[26, 30, 27]).annotate(
        num_herramientas=Count(
            'asignaciones_herramientas',
            filter=Q(asignaciones_herramientas__fecha_devolucion__isnull=True)
        )
    ).order_by('nombre_unidad')
    
    return render(request, 'inventario_herramientas/asignar_herramientas.html', {
        "user": user,
        'jerarquia': user['jerarquia'],
        'nombres': user['nombres'],
        'apellidos': user['apellidos'],
        'unidades': unidades,
        'seccion_activa': 'asignaciones'
    })


def detalle_asignacion(request, unidad_id):
    user = request.session.get('user')
    if not user:
        return redirect('/')

    unidad = get_object_or_404(Unidades, pk=unidad_id)
    
    # Obtener asignaciones activas
    asignaciones = AsignacionHerramienta.objects.filter(
        unidad=unidad,
        fecha_devolucion__isnull=True
    ).select_related('herramienta', 'herramienta__categoria').order_by('herramienta__nombre')
    
    if request.method == 'POST':
        form = AsignacionMasivaForm(request.POST)
        if form.is_valid():
            try:
                with transaction.atomic():
                    for tool_id, cantidad in form.cleaned_data['selected_tools']:
                        herramienta = Herramienta.objects.get(id=tool_id)
                        
                        # Verificar disponibilidad nuevamente (por si cambió)
                        if cantidad > herramienta.cantidad_disponible:
                            raise ValidationError(f"No hay suficientes unidades de {herramienta.nombre}")
                        
                        # Buscar asignación existente
                        asignacion_existente = AsignacionHerramienta.objects.filter(
                            herramienta=herramienta,
                            unidad=unidad,
                            fecha_devolucion__isnull=True
                        ).first()
                        
                        if asignacion_existente:
                            asignacion_existente.cantidad += cantidad
                            asignacion_existente.save()
                        else:
                            AsignacionHerramienta.objects.create(
                                herramienta=herramienta,
                                unidad=unidad,
                                cantidad=cantidad,
                                fecha_asignacion=timezone.now().date()
                            )
                            
                messages.success(request, 'Asignación completada correctamente')
                return redirect('detalle-asignacion', unidad_id=unidad.id)
            except Exception as e:
                messages.error(request, f'Error durante la asignación: {str(e)}')
    else:
        form = AsignacionMasivaForm()
    
    context = {
        "user": user,
        'jerarquia': user['jerarquia'],
        'nombres': user['nombres'],
        'apellidos': user['apellidos'],
        'unidad': unidad,
        'asignaciones': asignaciones,
        'form': form,
        'seccion_activa': 'asignaciones'
    }
    return render(request, 'inventario_herramientas/detalles_asignacion.html', context)


def devolver_herramienta(request, asignacion_id):
    asignacion = get_object_or_404(
        AsignacionHerramienta,
        pk=asignacion_id,
        fecha_devolucion__isnull=True  # Solo permite devolver asignaciones activas
    )
    
    try:
        # Registrar la devolución
        asignacion.fecha_devolucion = timezone.now().date()
        asignacion.save()
        
        messages.success(
            request,
            f'Herramienta {asignacion.herramienta.nombre} devuelta correctamente'
        )
    except Exception as e:
        messages.error(
            request,
            f'Error al devolver la herramienta: {str(e)}'
        )
    
    # Redirigir al detalle de la unidad
    return redirect('detalle-asignacion', unidad_id=asignacion.unidad.id)

# 3- Auditoria y Reportes ===================================
# @login_required
# def auditoria_inventario(request):
#     # Últimos inventarios por unidad
#     ultimos_inventarios = InventarioUnidad.objects.filter(
#         id__in=InventarioUnidad.objects.values('unidad')
#         .annotate(max_id=Max('id'))
#         .values_list('id', flat=True)
#     ).select_related('unidad')
    
#     # Alertas (herramientas no presentes en último inventario)
#     alertas = DetalleInventario.objects.filter(
#         inventario_id__in=ultimos_inventarios,
#         presente=False
#     ).select_related('herramienta', 'inventario__unidad')
    
#     # Estadísticas
#     stats = {
#         'total_herramientas': Herramienta.objects.count(),
#         'asignadas': AsignacionHerramienta.objects.filter(
#             fecha_devolucion__isnull=True).count(),
#         'porcentaje_discrepancias': (alertas.count() / Herramienta.objects.count()) * 100 if Herramienta.objects.count() > 0 else 0
#     }
    
#     return render(request, 'inventario/auditoria.html', {
#         'ultimos_inventarios': ultimos_inventarios,
#         'alertas': alertas,
#         'stats': stats
#     })




# ======================== Conductores ========================
def conductores(request):
    user = request.session.get('user')
    if not user:
        return redirect('/')
    
    hoy = localdate()
    conductores = Conductor.objects.select_related('personal').prefetch_related(
        'licencias', 'certificados_medicos'
    ).all()
    
    return render(request, "mecanica/conductores.html", {
        "user": user,
        "jerarquia": user["jerarquia"],
        "nombres": user["nombres"],
        "apellidos": user["apellidos"],
        "conductores": conductores,
        "hoy": hoy
    })

def agregar_conductor(request):
    user = request.session.get('user')
    if not user:
        return redirect('/')
    
    if request.method == 'POST':
        form = ConductorForm(request.POST, request.FILES)
        licencia_formset = LicenciaFormSet(request.POST, request.FILES, prefix='licencias')
        certificado_formset = CertificadoMedicoFormSet(
            request.POST, 
            request.FILES, 
            instance=form.instance if form.is_valid() else None,
            prefix='certificados'
        )
        
        if form.is_valid() and licencia_formset.is_valid() and certificado_formset.is_valid():
            conductor = form.save()
            
            # Guardar licencias
            licencias = licencia_formset.save(commit=False)
            for licencia in licencias:
                licencia.conductor = conductor
                licencia.save()
            
            # Guardar certificados
            certificados = certificado_formset.save(commit=False)
            for certificado in certificados:
                certificado.conductor = conductor
                certificado.save()
            
            messages.success(request, 'Conductor registrado exitosamente!')
            return redirect('conductores')
    else:
        form = ConductorForm()
        licencia_formset = LicenciaFormSet(prefix='licencias')
        certificado_formset = CertificadoMedicoFormSet(
            prefix='certificados',
            instance=None  # Para nuevo conductor
        )
    
    return render(request, "mecanica/agregar_conductor.html", {
        "user": user,
        "jerarquia": user["jerarquia"],
        "nombres": user["nombres"],
        "apellidos": user["apellidos"],
        "form": form,
        "licencia_formset": licencia_formset,
        "certificado_formset": certificado_formset,
    })

def editar_conductor(request, id):
    user = request.session.get('user')
    if not user:
        return redirect('/')

    if id:
        conductor = get_object_or_404(Conductor, pk=id)
        formset_extra = 0  # Modo edición: no agregar formularios extra
    else:
        conductor = None
        formset_extra = 1  # Modo creación: agregar 1 formulario vacío


    LicenciaFormSet = inlineformset_factory(
        Conductor,
        LicenciaConductor,
        form=LicenciaConductorForm,
        formset=LicenciaConductorFormSet,
        extra=formset_extra,  # Dinámico según creación/edición
        can_delete=True
    )
    
    conductor = get_object_or_404(Conductor, id=id)
    
    if request.method == 'POST':
        form = ConductorForm(request.POST, request.FILES, instance=conductor)
        licencia_formset = LicenciaFormSet(request.POST, request.FILES, instance=conductor, prefix='licencias')
        certificado_formset = CertificadoMedicoFormSet(request.POST, request.FILES, instance=conductor, prefix='certificados')
        
        # Validación mejorada
        if form.is_valid():
            conductor = form.save()
            saved = True
            
            # Procesar licencias
            if licencia_formset.is_valid():
                for licencia_form in licencia_formset:
                    if licencia_form.has_changed():
                        if licencia_form.cleaned_data.get('DELETE'):
                            if licencia_form.instance.pk:
                                licencia_form.instance.delete()
                        else:
                            licencia = licencia_form.save(commit=False)
                            licencia.conductor = conductor
                            # Validación manual para evitar duplicados
                            if not licencia.pk:  # Solo para nuevas licencias
                                if LicenciaConductor.objects.filter(
                                    numero_licencia=licencia.numero_licencia,
                                    tipo_licencia=licencia.tipo_licencia
                                ).exists():
                                    messages.error(request, f'La licencia {licencia.numero_licencia} ya existe')
                                    saved = False
                                    break
                            licencia.save()
            else:
                saved = False
                for error in licencia_formset.errors:
                    if '__all__' in error:
                        messages.error(request, error['__all__'])
            
            # Procesar certificados
            if saved and certificado_formset.is_valid():
                for certificado_form in certificado_formset:
                    if certificado_form.has_changed():
                        if certificado_form.cleaned_data.get('DELETE'):
                            if certificado_form.instance.pk:
                                certificado_form.instance.delete()
                        else:
                            certificado = certificado_form.save(commit=False)
                            certificado.conductor = conductor
                            certificado.save()
            elif saved:
                saved = False
                messages.error(request, 'Error en los certificados médicos')
            
            if saved:
                messages.success(request, 'Conductor actualizado exitosamente!')
                return redirect('conductores')
        else:
            messages.error(request, 'Error en el formulario principal')
    
    else:
        form = ConductorForm(instance=conductor)
        licencia_formset = LicenciaFormSet(instance=conductor, prefix='licencias')
        certificado_formset = CertificadoMedicoFormSet(instance=conductor, prefix='certificados')
    
    context = {
        "user": user,
        "form": form,
        "licencia_formset": licencia_formset,
        "certificado_formset": certificado_formset,
        "conductor": conductor,
        "jerarquia": user["jerarquia"],
        "nombres": user["nombres"],
        "apellidos": user["apellidos"],
    }
    return render(request, "mecanica/editar_conductor.html", context)

def api_conductores(request):
    hoy = date.today().isoformat()
    conductores = Conductor.objects.select_related('personal').prefetch_related(
        'licencias', 'certificados_medicos'
    ).all()
    
    data = []
    for conductor in conductores:
        conductor_dict = {
            'id': conductor.id,
            'activo': conductor.activo,
            'observaciones_generales': conductor.observaciones_generales,
            'personal': model_to_dict(conductor.personal),
            'licencias': [],
            'certificados_medicos': []
        }
        
        for licencia in conductor.licencias.all():
            conductor_dict['licencias'].append({
                'id': licencia.id,
                'tipo_licencia_display': licencia.get_tipo_licencia_display(),
                'numero_licencia': licencia.numero_licencia,
                'fecha_emision': licencia.fecha_emision.isoformat(),
                'fecha_vencimiento': licencia.fecha_vencimiento.isoformat(),
                'organismo_emisor': licencia.organismo_emisor,
                'activa': licencia.activa
            })
        
        for certificado in conductor.certificados_medicos.all():
            conductor_dict['certificados_medicos'].append({
                'id': certificado.id,
                'fecha_emision': certificado.fecha_emision.isoformat(),
                'fecha_vencimiento': certificado.fecha_vencimiento.isoformat(),
                'centro_medico': certificado.centro_medico,
                'medico': certificado.medico,
                'activo': certificado.activo
            })
        
        data.append(conductor_dict)
    
    return JsonResponse(data, safe=False)

@require_http_methods(["DELETE"])
def api_eliminar_conductor(request, id):
    try:
        conductor = Conductor.objects.get(id=id)
        conductor.delete()
        return JsonResponse({'success': True})
    except Conductor.DoesNotExist:
        return JsonResponse({'error': 'Conductor no encontrado'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)





# ====================================================== APIs ======================================================================================

def contar_estados_unidades(request):
    # Obtener todos los estados de las unidades
    estados = Unidades_Detalles.objects.values_list("estado", flat=True)

    # Contar cuántas unidades hay en cada estado
    conteo_estados = Counter(estados)

    # Crear la respuesta JSON
    datos = {
        "activa": conteo_estados.get("🟢 Activo", 0),
        "fuera_de_servicio": conteo_estados.get("🔴 Fuera de Servicio", 0),
        "en_mantenimiento": conteo_estados.get("🟡 Mantenimiento", 0),
    }

    return JsonResponse(datos)

def contar_reportes_combustible(request):
    # Obtener el servicio "Suministro de Combustible"
    try:
        servicio_combustible = Servicios.objects.get(nombre_servicio="Suministro de Combustible")
    except Servicios.DoesNotExist:
        return JsonResponse({"error": "El servicio no existe"}, status=404)

    # Obtener fechas
    hoy = now().date()
    inicio_semana = hoy - timedelta(days=hoy.weekday())  # Lunes de esta semana
    inicio_mes = hoy.replace(day=1)  # Primer día del mes

    # Contar reportes por día
    reportes_hoy = Reportes_Unidades.objects.filter(
        servicio=servicio_combustible, fecha=hoy
    ).count()

    # Contar reportes por semana
    reportes_semana = Reportes_Unidades.objects.filter(
        servicio=servicio_combustible, fecha__range=[inicio_semana, hoy]
    ).count()

    # Contar reportes por mes
    reportes_mes = Reportes_Unidades.objects.filter(
        servicio=servicio_combustible, fecha__range=[inicio_mes, hoy]
    ).count()

    # Crear respuesta JSON
    datos = {
        "reportes_hoy": reportes_hoy,
        "reportes_semana": reportes_semana,
        "reportes_mes": reportes_mes,
    }

    return JsonResponse(datos)

def contar_reporte_lubricantes(request):
    # Obtener el servicio "Suministro de Combustible"
    try:
        servicio_combustible = Servicios.objects.get(nombre_servicio="Suministro de Lubricantes")
    except Servicios.DoesNotExist:
        return JsonResponse({"error": "El servicio no existe"}, status=404)

    # Obtener fechas
    hoy = now().date()
    inicio_semana = hoy - timedelta(days=hoy.weekday())  # Lunes de esta semana
    inicio_mes = hoy.replace(day=1)  # Primer día del mes

    # Contar reportes por día
    reportes_hoy = Reportes_Unidades.objects.filter(
        servicio=servicio_combustible, fecha=hoy
    ).count()

    # Contar reportes por semana
    reportes_semana = Reportes_Unidades.objects.filter(
        servicio=servicio_combustible, fecha__range=[inicio_semana, hoy]
    ).count()

    # Contar reportes por mes
    reportes_mes = Reportes_Unidades.objects.filter(
        servicio=servicio_combustible, fecha__range=[inicio_mes, hoy]
    ).count()

    # Crear respuesta JSON
    datos = {
        "reportes_hoy": reportes_hoy,
        "reportes_semana": reportes_semana,
        "reportes_mes": reportes_mes,
    }

    return JsonResponse(datos)

def contar_reporte_neumaticos(request):
    # Obtener el servicio "Suministro de Combustible"
    try:
        servicio_combustible = Servicios.objects.get(nombre_servicio="Cambios de Neumáticos")
    except Servicios.DoesNotExist:
        return JsonResponse({"error": "El servicio no existe"}, status=404)

    # Obtener fechas
    hoy = now().date()
    inicio_semana = hoy - timedelta(days=hoy.weekday())  # Lunes de esta semana
    inicio_mes = hoy.replace(day=1)  # Primer día del mes

    # Contar reportes por día
    reportes_hoy = Reportes_Unidades.objects.filter(
        servicio=servicio_combustible, fecha=hoy
    ).count()

    # Contar reportes por semana
    reportes_semana = Reportes_Unidades.objects.filter(
        servicio=servicio_combustible, fecha__range=[inicio_semana, hoy]
    ).count()

    # Contar reportes por mes
    reportes_mes = Reportes_Unidades.objects.filter(
        servicio=servicio_combustible, fecha__range=[inicio_mes, hoy]
    ).count()

    # Crear respuesta JSON
    datos = {
        "reportes_hoy": reportes_hoy,
        "reportes_semana": reportes_semana,
        "reportes_mes": reportes_mes,
    }

    return JsonResponse(datos)

def contar_reporte_reparaciones(request):
    # Obtener el servicio "Suministro de Combustible"
    try:
        servicio_combustible = Servicios.objects.get(nombre_servicio="Reparaciones Mecánicas")
    except Servicios.DoesNotExist:
        return JsonResponse({"error": "El servicio no existe"}, status=404)

    # Obtener fechas
    hoy = now().date()
    inicio_semana = hoy - timedelta(days=hoy.weekday())  # Lunes de esta semana
    inicio_mes = hoy.replace(day=1)  # Primer día del mes

    # Contar reportes por día
    reportes_hoy = Reportes_Unidades.objects.filter(
        servicio=servicio_combustible, fecha=hoy
    ).count()

    # Contar reportes por semana
    reportes_semana = Reportes_Unidades.objects.filter(
        servicio=servicio_combustible, fecha__range=[inicio_semana, hoy]
    ).count()

    # Contar reportes por mes
    reportes_mes = Reportes_Unidades.objects.filter(
        servicio=servicio_combustible, fecha__range=[inicio_mes, hoy]
    ).count()

    # Crear respuesta JSON
    datos = {
        "reportes_hoy": reportes_hoy,
        "reportes_semana": reportes_semana,
        "reportes_mes": reportes_mes,
    }

    return JsonResponse(datos)

def contar_reporte_electricas(request):
    # Obtener el servicio "Suministro de Combustible"
    try:
        servicio_combustible = Servicios.objects.get(nombre_servicio="Reparaciones Eléctricas")
    except Servicios.DoesNotExist:
        return JsonResponse({"error": "El servicio no existe"}, status=404)

    # Obtener fechas
    hoy = now().date()
    inicio_semana = hoy - timedelta(days=hoy.weekday())  # Lunes de esta semana
    inicio_mes = hoy.replace(day=1)  # Primer día del mes

    # Contar reportes por día
    reportes_hoy = Reportes_Unidades.objects.filter(
        servicio=servicio_combustible, fecha=hoy
    ).count()

    # Contar reportes por semana
    reportes_semana = Reportes_Unidades.objects.filter(
        servicio=servicio_combustible, fecha__range=[inicio_semana, hoy]
    ).count()

    # Contar reportes por mes
    reportes_mes = Reportes_Unidades.objects.filter(
        servicio=servicio_combustible, fecha__range=[inicio_mes, hoy]
    ).count()

    # Crear respuesta JSON
    datos = {
        "reportes_hoy": reportes_hoy,
        "reportes_semana": reportes_semana,
        "reportes_mes": reportes_mes,
    }

    return JsonResponse(datos)

def contar_reporte_cambio_repuestos(request):
    # Obtener el servicio "Suministro de Combustible"
    try:
        servicio_combustible = Servicios.objects.get(nombre_servicio="Cambio de Repuestos")
    except Servicios.DoesNotExist:
        return JsonResponse({"error": "El servicio no existe"}, status=404)

    # Obtener fechas
    hoy = now().date()
    inicio_semana = hoy - timedelta(days=hoy.weekday())  # Lunes de esta semana
    inicio_mes = hoy.replace(day=1)  # Primer día del mes

    # Contar reportes por día
    reportes_hoy = Reportes_Unidades.objects.filter(
        servicio=servicio_combustible, fecha=hoy
    ).count()

    # Contar reportes por semana
    reportes_semana = Reportes_Unidades.objects.filter(
        servicio=servicio_combustible, fecha__range=[inicio_semana, hoy]
    ).count()

    # Contar reportes por mes
    reportes_mes = Reportes_Unidades.objects.filter(
        servicio=servicio_combustible, fecha__range=[inicio_mes, hoy]
    ).count()

    # Crear respuesta JSON
    datos = {
        "reportes_hoy": reportes_hoy,
        "reportes_semana": reportes_semana,
        "reportes_mes": reportes_mes,
    }

    return JsonResponse(datos)

def contar_reporte_colisiones_danos(request):
    # Obtener el servicio "Colisiones o Daños"
    try:
        servicio_colisiones = Servicios.objects.get(nombre_servicio="Colisiones o Daños")
    except Servicios.DoesNotExist:
        return JsonResponse({"error": "El servicio no existe"}, status=404)

    # Obtener fechas
    hoy = now().date()
    inicio_semana = hoy - timedelta(days=hoy.weekday())  # Lunes de esta semana
    inicio_mes = hoy.replace(day=1)  # Primer día del mes

    # Contar reportes por día
    reportes_hoy = Reportes_Unidades.objects.filter(
        servicio=servicio_colisiones, fecha=hoy
    ).count()

    # Contar reportes por semana
    reportes_semana = Reportes_Unidades.objects.filter(
        servicio=servicio_colisiones, fecha__range=[inicio_semana, hoy]
    ).count()

    # Contar reportes por mes
    reportes_mes = Reportes_Unidades.objects.filter(
        servicio=servicio_colisiones, fecha__range=[inicio_mes, hoy]
    ).count()

    # Crear respuesta JSON
    datos = {
        "reportes_hoy": reportes_hoy,
        "reportes_semana": reportes_semana,
        "reportes_mes": reportes_mes,
    }

    return JsonResponse(datos)



# =================================== DESCARGAS =================================================
def generar_excel_reportes_unidades(request):
    mes_str = request.GET.get('mes', None)

    reportes = Reportes_Unidades.objects.select_related('id_unidad', 'servicio').order_by('-fecha', '-hora')

    if mes_str:
        try:
            mes = int(mes_str.split('-')[1])
            reportes = [reporte for reporte in reportes if reporte.fecha.month == mes]
        except (ValueError, IndexError):
            return JsonResponse({'error': 'Formato de mes incorrecto'}, status=400)

    data = []

    for reporte in reportes:
        data.append({
            'nombre unidad': reporte.id_unidad.nombre_unidad,
            'servicio': reporte.servicio.nombre_servicio,
            'fecha': reporte.fecha.isoformat(),
            'hora': reporte.hora.isoformat(),
            'descripcion': reporte.descripcion,
            'persona responsable': reporte.persona_responsable,
        })

    df = pd.DataFrame(data).sort_values(by=['fecha'], ascending=[False])

    json_data = df.to_json(orient='records', date_format='iso')

    return JsonResponse(json.loads(json_data), safe=False)

