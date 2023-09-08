import { IsArray, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
    @IsNotEmpty({ message: "name khong dc de trong " })
    name: string;

    @IsNotEmpty({ message: "isActive khong dc de trong " })
    @IsBoolean({ message: "isActive khong dc de trong " })
    isActive: string;

    @IsNotEmpty({ message: "permissions khong dc de trong " })
    @IsArray({ message: "permissions khong dung dinh dang array " })
    permissions: string[];

    

}