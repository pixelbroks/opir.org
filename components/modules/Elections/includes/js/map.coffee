###*
 * @package        Elections
 * @category       modules
 * @author         Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright      Copyright (c) 2014, Nazar Mokrynskyi
 * @license        MIT License, see license.txt
###

$ ->
	if cs.module != 'Elections'
		return
	cs.elections.loading('show')
	$('#map').show()
	user_location	= null
	L				= cs.Language
	ymaps.ready ->
		user_location	= localStorage.getItem('coordinates')
		if user_location
			user_location	= JSON.parse(user_location)
			begin()
		else
			ymaps.geolocation.get(
				autoReverseGeocode	: false
				provider			: 'yandex'
			).then (result) ->
				user_location	= result.geoObjects.get(0).geometry.getCoordinates()
				setTimeout(begin, 0)
				ymaps.geolocation.get(
					autoReverseGeocode	: false
				).then (result) ->
					user_location	= result.geoObjects.get(0).geometry.getCoordinates()
					map.panTo(user_location)
					localStorage.setItem('coordinates', JSON.stringify(user_location))
	begin = ->
		window.map	= new ymaps.Map(
			'map'
			{
				center				: user_location
				zoom				: 15
				controls			: ['typeSelector', 'zoomControl', 'fullscreenControl', 'rulerControl', 'trafficControl']
			}
			{
				avoidFractionalZoom	: false
			}
		)
		cluster_icons	= [
			{
				href	: '/components/modules/Elections/includes/img/cluster-46.png'
				size	: [46, 46]
				offset	: [-23, -23]
			}
			{
				href	: '/components/modules/Elections/includes/img/cluster-58.png'
				size	: [58, 58]
				offset	: [-27, -27]
			}
		]
		districts_clusterer		= new ymaps.Clusterer(
			clusterIcons	: cluster_icons
			hasBalloon		: false
			hasHint			: false
		)
		precincts_clusterer	= new ymaps.Clusterer(
			clusterIcons	: cluster_icons
			hasHint			: false,
			maxZoom			: 15
		)
		map.geoObjects.add(precincts_clusterer)
		do ->
			previous_zoom	= 15
			map.events.add('boundschange', (e)->
				# If previous and current zoom both smaller or greater than 14 - there is no need to change placemarks detalization
				if (previous_zoom < 13) == (e.get('newZoom') < 13)
					if previous_zoom > 13
						setTimeout(add_precincts_on_map, 0)
					return
				previous_zoom	= e.get('newZoom')
				if previous_zoom < 13
					map.geoObjects.remove(precincts_clusterer)
					map.geoObjects.add(districts_clusterer)
				else
					map.geoObjects.remove(districts_clusterer)
					map.geoObjects.add(precincts_clusterer)
					setTimeout(add_precincts_on_map, 0)
			)
		districts_icons_shape	= new ymaps.shape.Polygon(new ymaps.geometry.pixel.Polygon([
			[
				[0-40, 32-41],
				[11-40, 11-41],
				[31-40, 0-41],
				[47-40, 0-41],
				[68-40, 11-41],
				[79-40, 32-41],
				[78-40, 49-41],
				[67-40, 67-41],
				[52-40, 77-41],
				[31-40, 78-41],
				[11-40, 67-41],
				[0-40, 48-41],
				[0-40, 32-41]
			]
		]))
		districts_precincts_icons_shape	= new ymaps.shape.Polygon(new ymaps.geometry.pixel.Polygon([
			[
				[22-40, 53-41],
				[4-40, 35-41],
				[1-40, 29-41],
				[0-40, 25-41],
				[0-40, 18-41],
				[5-40, 8-41],
				[12-40, 2-41],
				[21-40, 0-41],
				[30-40, 1-41],
				[38-40, 7-41],
				[44-40, 16-41],
				[45-40, 27-41],
				[41-40, 35-41],
				[22-40, 53-41]
			]
		]))
		precincts_icons_shape	= new ymaps.shape.Polygon(new ymaps.geometry.pixel.Polygon([
			[
				[15-15, 37-36],
				[1-15, 22-36],
				[0-15, 16-36],
				[1-15, 10-36],
				[5-15, 5-36],
				[11-15, 1-36],
				[19-15, 1-36],
				[26-15, 5-36],
				[31-15, 14-36],
				[30-15, 22-36],
				[15-15, 37-36]
			]
		]))
		filter_precincts	= (precincts) ->
			bounds	= map.getBounds()
			result = {}
			for precinct, precinct of precincts
				lat	= parseFloat(precinct.lat)
				lng	= parseFloat(precinct.lng)
				if (
					lat > bounds[0][0] && lat < bounds[1][0] &&
					lng > bounds[0][1] && lng < bounds[1][1]
				)
					result[precinct.id] = precinct
			result
		add_precincts_on_map	= ->
			placemarks	= []
			for precinct, precinct of filter_precincts(cs.elections.get_precincts())
				if precinct.number.length > 3
					placemark = new ymaps.Placemark(
						[precinct.lat, precinct.lng]
						{
							hintContent				: L.precint_number(precinct.number)
							balloonContentHeader	: L.precint_number(precinct.number)
						}
						{
							iconLayout			: 'default#image'
							iconImageHref		: '/components/modules/Elections/includes/img/map-precincts.png'
							iconImageSize		: [38, 37]
							iconImageOffset		: [-15, -36]
							iconImageClipRect	: [
								[38 * (if precinct.violations then 1 else 0), 0],
								[38 * ((if precinct.violations then 1 else 0) + 1), 37]
							]
							iconImageShape		: precincts_icons_shape
						}
					)
				else
					placemark = new ymaps.Placemark(
						[precinct.lat, precinct.lng]
						{
							hintContent				: if precinct.number == '0' then L.cec else L.district_precint_number(precinct.number)
							balloonContentHeader	: if precinct.number == '0' then L.cec else L.district_precint_number(precinct.number)
						}
						{
							iconLayout			: 'default#image'
							iconImageHref		: '/components/modules/Elections/includes/img/map-districts-precincts.png'
							iconImageSize		: [56, 53]
							iconImageOffset		: [-23, -52]
							iconImageClipRect	: [
								[56 * (if precinct.violations then 1 else 0), 0],
								[56 * ((if precinct.violations then 1 else 0) + 1), 53]
							]
							iconImageShape		: districts_precincts_icons_shape
						}
					)
				do (id = precinct.id) ->
					placemark.events.add('click', ->
						cs.elections.open_precinct(id)
					)
				placemarks.push(placemark)
			precincts_clusterer.removeAll()
			precincts_clusterer.add(placemarks)
			cs.elections.loading('hide')
		add_districts_on_map	= ->
			districts	= cs.elections.get_districts()
			placemarks	= []
			for district, district of districts
				placemarks.push(
					new ymaps.Placemark(
						[district.lat, district.lng]
						{
							hasBalloon	: false
							hasHint		: false
							iconContent	: '<div class="cs-elections-map-district-placemark-content'+(if parseInt(district.violations) then ' violations' else '')+'">'+cs.Language.district_map_content(district.district)+'</div>'
						}
						{
							iconLayout			: 'default#imageWithContent'
							iconImageHref		: '/components/modules/Elections/includes/img/map-districts.png'
							iconImageSize		: [81, 82]
							iconImageOffset		: [-40, -41]
							iconImageClipRect	: [
								[81 * (if district.violations then 1 else 0), 0],
								[81 * ((if district.violations then 1 else 0) + 1), 82]
							]
							iconImageShape		: districts_icons_shape
						}
					)
				)
			districts_clusterer.removeAll()
			districts_clusterer.add(placemarks)
		if !cs.elections.get_districts(true) || localStorage.getItem('districts_version') != '5'
			$.ajax(
				url			: 'api/Districts'
				type		: 'get'
				data		: null
				success		: (loaded_districts) ->
					districts = {}
					for district in loaded_districts
						districts[district.district] = district
					localStorage.setItem('districts', JSON.stringify(districts))
					localStorage.setItem('districts_version', '5')
					add_districts_on_map()
				error		: ->
					console.error('Districts loading error')
			)
		else
			add_districts_on_map()
			$.ajax(
				url			: 'api/Districts?fields=violations'
				type		: 'get'
				data		: null
				success		: (violations_loaded) ->
					districts	= cs.elections.get_districts()
					update		= false
					for district in violations_loaded
						update = update || (districts[district.district].violations != district.violations)
						if update
							districts[district.district].violations = district.violations
					if update
						localStorage.setItem('districts', JSON.stringify(districts))
						add_districts_on_map()
				error		: ->
					console.error('Districts loading error')
			)
		if !cs.elections.get_precincts(true) || localStorage.getItem('precincts_version') != '5'
			$.ajax(
				url			: 'api/Precincts?flat'
				type		: 'get'
				data		: null
				success		: (loaded_precincts) ->
					precincts = {}
					for precinct, i in loaded_precincts.id
						precincts[precinct] = {
							id			: precinct
							lat			: loaded_precincts.lat[i]
							lng			: loaded_precincts.lng[i]
							number		: loaded_precincts.number[i]
							violations	: loaded_precincts.violations[i]
						}
					cs.elections.set_precincts(precincts)
					localStorage.setItem('precincts_version', '5')
					add_precincts_on_map()
				error		: ->
					console.error('Precincts loading error')
			)
		else
			add_precincts_on_map()
			$.ajax(
				url			: 'api/Precincts?fields=violations&flat'
				type		: 'get'
				data		: null
				success		: (violations_loaded) ->
					precincts	= cs.elections.get_precincts()
					update		= false
					for precinct, i in violations_loaded.id
						update = update || (precincts[precinct].violations != violations_loaded.violations[i])
						if update
							precincts[precinct].violations = violations_loaded.violations[i]
					if update
						cs.elections.set_precincts(precincts)
						add_precincts_on_map()
				error		: ->
					console.error('Precincts loading error')
			)
		return
