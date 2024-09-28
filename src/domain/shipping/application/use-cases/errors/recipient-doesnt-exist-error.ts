import { UseCaseError } from '@/core/errors/use-case-error'

export class RecipientDoesntExistError extends Error implements UseCaseError {
  constructor(id: string) {
    super(`Recipient "${id}" doesnt exist.`)
  }
}
