import * as t from 'io-ts';
import { RemoteData } from './remote-data';
export interface JSONFailure<L> {
    type: 'Failure';
    error: L;
}
export interface JSONInitial {
    type: 'Initial';
}
export interface JSONProgress {
    loaded: number;
    total: number | null;
}
export interface JSONPending {
    type: 'Pending';
    progress: JSONProgress | null;
}
export interface JSONSuccess<A> {
    type: 'Success';
    value: A;
}
export declare type JSONRemoteData<L, A> = JSONFailure<L> | JSONInitial | JSONPending | JSONSuccess<A>;
export declare class RemoteDataFromJSONType<L extends t.Any, R extends t.Any, A = any, O = A, I = t.mixed> extends t.Type<A, O, I> {
    readonly left: L;
    readonly right: R;
    readonly _tag: 'RemoteDataFromJSONType';
    constructor(name: string, is: RemoteDataFromJSONType<L, R, A, O, I>['is'], validate: RemoteDataFromJSONType<L, R, A, O, I>['validate'], serialize: RemoteDataFromJSONType<L, R, A, O, I>['encode'], left: L, right: R);
}
export declare function createRemoteDataFromJSON<L extends t.Type<AL, OL>, R extends t.Type<AR, OR>, AL = t.TypeOf<L>, OL = t.OutputOf<L>, AR = t.TypeOf<R>, OR = t.OutputOf<R>>(leftType: L, rightType: R, name?: string): RemoteDataFromJSONType<L, R, RemoteData<AL, AR>, JSONRemoteData<OL, OR>, t.mixed>;
