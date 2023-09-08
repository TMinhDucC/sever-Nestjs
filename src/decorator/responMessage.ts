import { SetMetadata, CustomDecorator } from '@nestjs/common';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export const Response_Message = 'response message'
export const ResponseMessage = (message: string) =>
    SetMetadata(Response_Message, message);


