import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
    @IsNotEmpty({ message: "name khong dc de trong " })
    name: string;

    @IsNotEmpty({ message: "title khong dc de trong " })
    title: string;

    @IsNotEmpty({ message: "status khong dc de trong " })
    status: string;

}