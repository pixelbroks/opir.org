###*
 * @package        Elections
 * @category       modules
 * @author         Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright      Copyright (c) 2014, Nazar Mokrynskyi
 * @license        MIT License, see license.txt
###
window.cs.elections = window.cs.elections || {}
window.cs.elections.sign_in = ->
	$("""
		<div>
			<div class="cs-elections-sign-in" style="width: 400px;">
				<h2 class="uk-text-center">Увійти</h2>
				<a href="HybridAuth/Facebook">
					<span class="uk-icon-facebook"></span> Увійти через Facebook
				</a>
				<a href="HybridAuth/Vkontakte">
					<span class="uk-icon-vk"></span> Увійти через VK
				</a>
				<span class="cs-elections-sign-in-separator">#{cs.Language.or}</span>
				<form>
					<input type="text" id="login" placeholder="#{cs.Language.login}" autofocus>
					<input type="password" id="password" placeholder="#{cs.Language.password}">
					<button type="submit">#{cs.Language.sign_in}</button>
				</form>
			</div>
		</div>
	""")
		.appendTo('body')
		.find('form')
			.submit ->
				cs.sign_in($('#login').val(), $('#password').val())
				return false
			.end()
		.cs().modal('show')
		.on 'uk.modal.hide', ->
			$(this).remove()
