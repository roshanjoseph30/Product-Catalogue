export default defineEventHandler(async (event) => {
  const body = await readBody<{
    email: string
    password: string
  }>(event)

  const config = useRuntimeConfig(event)

  const expectedEmail = String(config.authEmail ?? '')
  const expectedPassword = String(config.authPassword ?? '')

  if (
    body.email !== expectedEmail ||
    body.password !== expectedPassword
  ) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid email or password'
    })
  }

  return {
    success: true,
    message: 'Login successful'
  }
})