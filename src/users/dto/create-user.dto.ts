import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateUserDto {
    @IsEmail({}, { message: "khong dung dinh dang email" })
    @IsNotEmpty({ message: "email khong dc de trong " })
    email: string;

    @IsNotEmpty({ message: "password khong dc de trong " })
    password: string;

    @IsNotEmpty({ message: "tasks khong dc de trong " })
    @IsArray({ message: "tasks khong dung dinh dang array " })
    tasks: string[];

    @IsNotEmpty({ message: "role khong dc de trong " })
    role: string;
}

export class RegisterDto {
    @IsEmail({}, { message: "khong dung dinh dang email" })
    @IsNotEmpty({ message: "email khong dc de trong " })
    email: string;

    @IsNotEmpty({ message: "password khong dc de trong " })
    password: string;

    @IsNotEmpty({ message: "name khong dc de trong " })
    name: string;

}