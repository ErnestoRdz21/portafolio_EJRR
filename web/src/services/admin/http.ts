import { ApiError } from '../api.ts'

export class FieldErrors extends ApiError {
  readonly fields: Record<string, string>

  constructor(fields: Record<string, string>) {
    super('Revisa los campos marcados.', 422)
    this.name = 'FieldErrors'
    this.fields = fields
  }
}
