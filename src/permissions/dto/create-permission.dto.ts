import { IsArray, IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {
    @IsNotEmpty({ message: "name khong dc de trong " })
    name: string;

    @IsNotEmpty({ message: "apiPath khong dc de trong " })
    apiPath: string;


    @IsNotEmpty({ message: "method khong dc de trong " })
    method: string;


    @IsNotEmpty({ message: "module khong dc de trong " })
    module: string;

}