import { IUserValidationRequest } from '../../../../adapters/Validations/IUserValidationRequest';
import { UserCreateDTO, UserUpdateDTO } from '../../../../core/Entities/user-entity';
import { UserSchemaCreate, UserSchemaEmail, UserSchemaUpdate } from './SchemasZod';

export class ZodUserValidation implements IUserValidationRequest {
    Create(data: UserCreateDTO): any {
        const valid = UserSchemaCreate.safeParse(data);
        if (!valid.success) {
            const details = valid.error.flatten().fieldErrors;
            return details;
        } else {
            return null;
        }
    }

    Email(email: string): any {
        const valid = UserSchemaEmail.safeParse({ email });

        if (!valid.success) {
            const details = valid.error.flatten().fieldErrors;
            return details;
        } else {
            return null;
        }
    }

    Update(data: UserUpdateDTO): any {
        const valid = UserSchemaUpdate.safeParse(data);
        if (!valid.success) {
            const details = valid.error.flatten().fieldErrors;
            return details;
        } else {
            return null;
        }
    }
}
