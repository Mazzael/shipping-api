import { Recipient } from '../../enterprise/entities/recipient'

export abstract class RecipientsRepository {
  abstract findById(id: string): Promise<Recipient | null>
  abstract findByEmail(id: string): Promise<Recipient | null>
  abstract create(recipient: Recipient): Promise<void>
  abstract save(recipient: Recipient): Promise<void>
  abstract delete(recipient: Recipient): Promise<void>
}
