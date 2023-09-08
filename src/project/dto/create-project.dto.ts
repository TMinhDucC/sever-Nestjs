import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateProjectDto {
    @IsNotEmpty({ message: "name khong dc de trong " })
    name: string;

    @IsNotEmpty({ message: "FileUrlDocument khong dc de trong " })
    FileUrlDocument: string;

    @IsNotEmpty({ message: "tasks khong dc de trong " })
    @IsArray({ message: "tasks khong dung dinh dang array " })
    tasks: string[];

    @IsNotEmpty({ message: "members khong dc de trong " })
    @IsArray({ message: "members khong dung dinh dang array " })
    members: string[];

}