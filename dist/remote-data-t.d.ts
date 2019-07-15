import { RemoteData, URI } from './remote-data';
import { ApplicativeComposition12, ApplicativeComposition22, Applicative2, Applicative1, Applicative, ApplicativeCompositionHKT2 } from 'fp-ts/lib/Applicative';
import { HKT, Kind, Kind2, URIS, URIS2 } from 'fp-ts/lib/HKT';
import { Monad, Monad1, Monad2 } from 'fp-ts/lib/Monad';
import { Functor2, Functor1, Functor } from 'fp-ts/lib/Functor';
import { Lazy } from 'fp-ts/lib/function';
export interface RemoteDataT<M, E, A> extends HKT<M, RemoteData<E, A>> {
}
export interface RemoteDataM<F> extends ApplicativeCompositionHKT2<F, URI> {
    readonly chain: <L, A, B>(f: (a: A) => HKT<F, RemoteData<L, B>>, fa: HKT<F, RemoteData<L, A>>) => HKT<F, RemoteData<L, B>>;
}
export interface RemoteDataM1<F extends URIS> extends ApplicativeComposition12<F, URI> {
    readonly chain: <L, A, B>(f: (a: A) => Kind<F, RemoteData<L, B>>, fa: Kind<F, RemoteData<L, A>>) => Kind<F, RemoteData<L, B>>;
}
export interface RemoteDataM2<F extends URIS2> extends ApplicativeComposition22<F, URI> {
    readonly chain: <L, M, A, B>(f: (a: A) => Kind2<F, M, RemoteData<L, B>>, fa: Kind2<F, M, RemoteData<L, A>>) => Kind2<F, M, RemoteData<L, B>>;
}
export declare function chain<F extends URIS2>(F: Monad2<F>): RemoteDataM2<F>['chain'];
export declare function chain<F extends URIS>(F: Monad1<F>): RemoteDataM1<F>['chain'];
export declare function chain<F>(F: Monad<F>): RemoteDataM<F>['chain'];
export declare function success<F extends URIS2>(F: Functor2<F>): <L, M, A>(fa: Kind2<F, M, A>) => Kind2<F, M, RemoteData<L, A>>;
export declare function success<F extends URIS>(F: Functor1<F>): <L, A>(fa: Kind<F, A>) => Kind<F, RemoteData<L, A>>;
export declare function success<F>(F: Functor<F>): <L, A>(fa: HKT<F, A>) => HKT<F, RemoteData<L, A>>;
export declare function failure<F extends URIS2>(F: Functor2<F>): <L, M, A>(fl: Kind2<F, M, L>) => Kind2<F, M, RemoteData<L, A>>;
export declare function failure<F extends URIS>(F: Functor1<F>): <L, A>(fl: Kind<F, L>) => Kind<F, RemoteData<L, A>>;
export declare function failure<F>(F: Functor<F>): <L, A>(fl: HKT<F, L>) => HKT<F, RemoteData<L, A>>;
export declare function fromRemoteData<F extends URIS2>(F: Applicative2<F>): <L, M, A>(fa: RemoteData<L, A>) => Kind2<F, M, RemoteData<L, A>>;
export declare function fromRemoteData<F extends URIS>(F: Applicative1<F>): <L, A>(fa: RemoteData<L, A>) => Kind<F, RemoteData<L, A>>;
export declare function fromRemoteData<F>(F: Applicative<F>): <L, A>(fa: RemoteData<L, A>) => HKT<F, RemoteData<L, A>>;
export declare function fold<F extends URIS2>(F: Functor2<F>): <B, L, M, A>(initial: B, pending: B, failure: (l: L) => B, success: (a: A) => B, fa: Kind2<F, M, RemoteData<L, A>>) => Kind2<F, M, B>;
export declare function fold<F extends URIS>(F: Functor1<F>): <B, L, A>(initial: B, pending: B, failure: (l: L) => B, success: (a: A) => B, fa: Kind<F, RemoteData<L, A>>) => Kind<F, B>;
export declare function foldL<F extends URIS2>(F: Functor2<F>): <B, L, M, A>(initial: Lazy<B>, pending: Lazy<B>, failure: (l: L) => B, success: (a: A) => B, fa: Kind2<F, M, RemoteData<L, A>>) => Kind2<F, M, B>;
export declare function foldL<F extends URIS>(F: Functor1<F>): <B, L, A>(initial: Lazy<B>, pending: Lazy<B>, failure: (l: L) => B, success: (a: A) => B, fa: Kind<F, RemoteData<L, A>>) => Kind<F, B>;
export declare function getRemoteDataT<M extends URIS2>(M: Monad2<M>): RemoteDataM2<M>;
export declare function getRemoteDataT<M extends URIS>(M: Monad1<M>): RemoteDataM1<M>;
export declare function getRemoteDataT<M>(M: Monad<M>): RemoteDataM<M>;
