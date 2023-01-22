<script lang="ts">
	import { supabaseClient } from '$lib/supabase';
	import { error } from '@sveltejs/kit';
	import type { PageData } from './$types';
	import { afterUpdate, tick } from 'svelte';
	export let data: PageData;
	let username: string | null;
	let messagesList: Array<any> = [];
	let newMessage: string;
	let element: Element;
	let userProfile: Object | null
	if (data.session) {
			const getProfile = async () => {
				let { data: profiles, error: err } = await supabaseClient
					.from('profiles')
					.select('*')
					.eq('id', data?.session?.user.id)
					.single();
				if (profiles) {
					profiles.username ? (username = profiles.username) : (username = 'anon');
					userProfile = profiles
				}

				if (err) {
					throw error(400, err.message);
				}
			};
			getProfile();
		try {
			const getMessages = async () => {
				let { data: messages, error: err } = await supabaseClient
					.from('messages')
					.select(
						`id,
				content,
				userid: profiles(username),
				sent`
					)
					.order('sent', { ascending: false })
					.range(0, 100);
				if (messages) {
					messagesList = messages.reverse();
				}
				if (err) {
					console.log('Error getting Messages: ' + err);
				}
			};
			getMessages();
		} catch (err) {
			console.log('Error fetching messages: ' + err);
			throw error(500, {
				message: 'Error: ' + err
			});
		}

		const profiles = supabaseClient
			.channel('custom-all-channel')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
				console.log(payload)
				if (payload.eventType == 'UPDATE' && payload.new.id === data?.session?.user.id) {
					userProfile = payload.new;
				}
			})
			.subscribe();

		const messages = supabaseClient
			.channel('custom-insert-channel')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'messages' },
				async (payload) => {
					if (payload.eventType == 'INSERT') {
						let { data: user, error: err } = await supabaseClient
							.from('profiles')
							.select('*')
							.eq('id', payload.new.userid)
							.single();
						payload.new.userid = user;
						messagesList = [...messagesList, payload.new];
						if (messagesList.length > 100) {
							messagesList.reverse().pop();
							messagesList.reverse();
						}
						
					}
					if (payload.eventType == 'DELETE') {
						messagesList = messagesList.filter((msg) => msg.id != payload.old.id);
					}
					if (payload.eventType == 'UPDATE') {
						messagesList[messagesList.findIndex((msg) => msg.id == payload.new.id)].content = payload.new.content;
					}
				}
			)
			.subscribe();
	}
	const sendNewMessage = async () => {
		if (newMessage == ''){
			newMessage = 'soy jodidamente gay'
		}
		const msgData = {
			content: newMessage,
			userid: data?.session?.user.id,
			sent: new Date(Date.now())
		};
		console.log('messagedata' + msgData);
		let { data: sentMessage, error: err } = await supabaseClient.from('messages').insert(msgData);
		if (err) {
			console.error(err);
		}
		newMessage = '';
	};
	afterUpdate(() => {
		if (messagesList) scrollToBottom(element);
	});
	const scrollToBottom = async (node: Element) => {
		node?.scroll({ top: node.scrollHeight, behavior: 'smooth' });
	};
</script>
<div
	class="maincont col-md-5 d-flex-column align-items-center justify-content-center text-center"
	style="margin:auto; height: 100%"
>
	<h1 class="text-center"><a href="/" style="text-decoration: none;">El Anexo</a></h1>
	<p class="text-center font-weight-light">Aquí no se habla mal de Chávez.</p>
	{#if username != 'anon' && username != undefined}
		<p class="text-center font-weight-light">Iniciaste sesión como: <strong>{username}</strong></p>
		<div class="chat card m-2 border-secondary d-flex-column justify-content-center">
			<div class="messages" bind:this={element}>
				{#each messagesList as message (message.id)}
					<div class="msg mb-1" style="text-align: left;">
						<div class="card text-white bg-dark">
							<div class="card-header" style="font-size: medium;">
								{message.userid.username}
								<small style="font-size: xx-small; color: #ea39b8;">
									{new Date(message.sent).toLocaleDateString() +
										' ' +
										new Date(message.sent).toLocaleTimeString()}
								</small>
							</div>
							<div class="card-body">
								<p class="card-text">
									{message.content}
								</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
			<div class="sendmsg">
				{#if userProfile?.is_mute === false}
				<form on:submit|preventDefault={sendNewMessage} class="p-2" autocomplete="off">
					<div class="input-group">
						<input
							type="text"
							name="content"
							id="textarea"
							class="form-control"
							bind:value={newMessage}
							placeholder="Mensaje"
						/>
						<button class="btn btn-primary" type="submit" id="basic-addon1">Enviar</button>
					</div>
				</form>
				{:else}
					<p>Has sido <span class="text-secondary"><strong>Silenciado</strong></span>, no puedes enviar mensajes</p>
				{/if}
			</div>
		</div>
		<form action="/logout" method="POST">
			<button type="submit" class="btn btn-primary text-center" style="margin: auto;"
				>Cerrar sesión</button
			>
		</form>
	{:else if username == 'anon'}
		<p>Ingresa un nombre de usuario</p>
		<form action="?/setUsername" method="post" class="auth-form">
			<input type="text" name="userid" style="display: none;" value={data?.session?.user.id} />
			<div class="input-group">
				<input
					type="text"
					name="username"
					id="username"
					class="form-control"
					placeholder="Username"
				/>
				<button class="btn btn-primary" type="submit" id="basic-addon1">Escoger</button>
			</div>
		</form>
	{:else}
		<div class="auth-buttons">
			<a href="/login" class="btn btn-primary">Login</a>
			<a href="/register" class="btn btn-secondary">Register</a>
		</div>
	{/if}
</div>

<style>
	:root {
		--chatheight: 70%;
		--sendmsgheight: 15%;
	}
	.chat {
		height: var(--chatheight);
		width: auto;
		position: relative;
		overflow: hidden;
	}
	.messages {
		overflow-y: auto;
		overflow-x: hidden;
		height: 90%;
		position: absolute;
		top: 0;
		width: 100%;
	}
	.sendmsg {
		position: absolute;
		bottom: 0;
		width: 100%;
	}
	.msg {
		width: 100%;
		position: sticky;
		bottom: auto;
	}
</style>
