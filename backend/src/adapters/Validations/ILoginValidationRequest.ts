import { LoginEntity } from '../../core/Entities/login-entity';

export interface ILoginValidationReqeust {
    create(data: LoginEntity): any;
}
