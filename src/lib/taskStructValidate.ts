import { Struct, StructError, create } from 'superstruct';
import { BadRequestError } from '@lib';

function throwBadRequest(err: unknown): never {
  //반환타입이 없는 함수
  if (err instanceof StructError) {
    //StructError는 superstruct가 검증 실패시 던지는 전용 에러
    //instance of는 객체가 특정 클래스의 인스턴스인지 확인하는 연산자
    throw new BadRequestError('잘못된 요청 형식');
  }
  throw err;
}

export function validate<T>(value: unknown, struct: Struct<T>): T {
  //반환타입을 T로 고정해서 undefine을 반환하는 경로를 제거
  try {
    return create(value, struct);
  } catch (err) {
    throwBadRequest(err);
  }
}
