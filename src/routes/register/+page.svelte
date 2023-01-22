<script lang="ts">
</script>
<div
	class="maincont col-md-4 d-flex align-items-center justify-content-center"
	style="margin:auto;"
>
	<form
		action="?/register"
		method="post"
		class="card border-primary mb-3 p-3 text-center"
		style="width: 20rem; height: 25rem;"
	>
		<div class="h3 mb-10 font-weight-normal card-header"><a href="/" style="text-decoration: none;">El Anexo</a></div>
		<div class="card-body mx-auto d-flex-column align-items-center" style="width: 18rem; padding-top:10%;">
			<div class="card-title">Registrarse</div>
			<div class="form-group mb-3">
				<input
					id="email"
					type="text"
					name="email"
					class="form-control"
					placeholder="Correo"
					required
				/>
			</div>
			<div class="form-group" style="margin-bottom: 5rem;">
				<input
					id="password"
					type="password"
					name="password"
					class="form-control"
					placeholder="Password"
					required
				/>
			</div>
			<div class="form-group mb-3">
				<button type="submit" class="btn btn-primary">Registrarse</button>
			</div>
		</div>
	</form>
</div>

<style>
	.maincont {
		height: 100%;
	}
</style>
<!-- <main>
	<h1>Register</h1>
	<form action="?/register" method="POST" class="auth-form">
		<label for=""> Email </label>
		<input type="text" name="email" />
		<label for=""> Password </label>
		<input type="password" name="password" />
		<button type="submit" class="btn btn-primary">Register</button>
	</form>
</main> -->
