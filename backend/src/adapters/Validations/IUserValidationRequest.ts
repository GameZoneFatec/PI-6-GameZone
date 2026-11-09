import { UserCreateDTO, UserUpdateDTO } from '../../core/Entities/user-entity';

export interface IUserValidationRequest {
    Create(data: UserCreateDTO): any;
    Email(email: string): any;
    Update(data: UserUpdateDTO): any;
}
