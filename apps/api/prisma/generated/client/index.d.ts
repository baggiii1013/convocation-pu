
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Attendee
 * 
 */
export type Attendee = $Result.DefaultSelection<Prisma.$AttendeePayload>
/**
 * Model SeatAllocation
 * 
 */
export type SeatAllocation = $Result.DefaultSelection<Prisma.$SeatAllocationPayload>
/**
 * Model Enclosure
 * 
 */
export type Enclosure = $Result.DefaultSelection<Prisma.$EnclosurePayload>
/**
 * Model Row
 * 
 */
export type Row = $Result.DefaultSelection<Prisma.$RowPayload>
/**
 * Model Analytics
 * 
 */
export type Analytics = $Result.DefaultSelection<Prisma.$AnalyticsPayload>
/**
 * Model IAMPolicy
 * 
 */
export type IAMPolicy = $Result.DefaultSelection<Prisma.$IAMPolicyPayload>
/**
 * Model Department
 * 
 */
export type Department = $Result.DefaultSelection<Prisma.$DepartmentPayload>
/**
 * Model Convocation
 * 
 */
export type Convocation = $Result.DefaultSelection<Prisma.$ConvocationPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  STUDENT: 'STUDENT'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const AccountState: {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION'
};

export type AccountState = (typeof AccountState)[keyof typeof AccountState]


export const TransactionStatus: {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED'
};

export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus]


export const EnclosureType: {
  STUDENTS: 'STUDENTS',
  FACULTY: 'FACULTY',
  STAFF: 'STAFF',
  GUESTS: 'GUESTS',
  VIP: 'VIP'
};

export type EnclosureType = (typeof EnclosureType)[keyof typeof EnclosureType]


export const Direction: {
  NORTH: 'NORTH',
  SOUTH: 'SOUTH',
  EAST: 'EAST',
  WEST: 'WEST',
  NORTHEAST: 'NORTHEAST',
  NORTHWEST: 'NORTHWEST',
  SOUTHEAST: 'SOUTHEAST',
  SOUTHWEST: 'SOUTHWEST'
};

export type Direction = (typeof Direction)[keyof typeof Direction]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type AccountState = $Enums.AccountState

export const AccountState: typeof $Enums.AccountState

export type TransactionStatus = $Enums.TransactionStatus

export const TransactionStatus: typeof $Enums.TransactionStatus

export type EnclosureType = $Enums.EnclosureType

export const EnclosureType: typeof $Enums.EnclosureType

export type Direction = $Enums.Direction

export const Direction: typeof $Enums.Direction

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Accounts
 * const accounts = await prisma.account.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Accounts
   * const accounts = await prisma.account.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P]): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number }): $Utils.JsPromise<R>

  /**
   * Executes a raw MongoDB command and returns the result of it.
   * @example
   * ```
   * const user = await prisma.$runCommandRaw({
   *   aggregate: 'User',
   *   pipeline: [{ $match: { name: 'Bob' } }, { $project: { email: true, _id: false } }],
   *   explain: false,
   * })
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $runCommandRaw(command: Prisma.InputJsonObject): Prisma.PrismaPromise<Prisma.JsonObject>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.attendee`: Exposes CRUD operations for the **Attendee** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Attendees
    * const attendees = await prisma.attendee.findMany()
    * ```
    */
  get attendee(): Prisma.AttendeeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.seatAllocation`: Exposes CRUD operations for the **SeatAllocation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SeatAllocations
    * const seatAllocations = await prisma.seatAllocation.findMany()
    * ```
    */
  get seatAllocation(): Prisma.SeatAllocationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.enclosure`: Exposes CRUD operations for the **Enclosure** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Enclosures
    * const enclosures = await prisma.enclosure.findMany()
    * ```
    */
  get enclosure(): Prisma.EnclosureDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.row`: Exposes CRUD operations for the **Row** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Rows
    * const rows = await prisma.row.findMany()
    * ```
    */
  get row(): Prisma.RowDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.analytics`: Exposes CRUD operations for the **Analytics** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Analytics
    * const analytics = await prisma.analytics.findMany()
    * ```
    */
  get analytics(): Prisma.AnalyticsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.iAMPolicy`: Exposes CRUD operations for the **IAMPolicy** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more IAMPolicies
    * const iAMPolicies = await prisma.iAMPolicy.findMany()
    * ```
    */
  get iAMPolicy(): Prisma.IAMPolicyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.department`: Exposes CRUD operations for the **Department** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Departments
    * const departments = await prisma.department.findMany()
    * ```
    */
  get department(): Prisma.DepartmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.convocation`: Exposes CRUD operations for the **Convocation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Convocations
    * const convocations = await prisma.convocation.findMany()
    * ```
    */
  get convocation(): Prisma.ConvocationDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.15.0
   * Query Engine version: 85179d7826409ee107a6ba334b5e305ae3fba9fb
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Account: 'Account',
    Attendee: 'Attendee',
    SeatAllocation: 'SeatAllocation',
    Enclosure: 'Enclosure',
    Row: 'Row',
    Analytics: 'Analytics',
    IAMPolicy: 'IAMPolicy',
    Department: 'Department',
    Convocation: 'Convocation'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "account" | "attendee" | "seatAllocation" | "enclosure" | "row" | "analytics" | "iAMPolicy" | "department" | "convocation"
      txIsolationLevel: never
    }
    model: {
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.AccountFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.AccountAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Attendee: {
        payload: Prisma.$AttendeePayload<ExtArgs>
        fields: Prisma.AttendeeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AttendeeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendeePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AttendeeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendeePayload>
          }
          findFirst: {
            args: Prisma.AttendeeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendeePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AttendeeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendeePayload>
          }
          findMany: {
            args: Prisma.AttendeeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendeePayload>[]
          }
          create: {
            args: Prisma.AttendeeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendeePayload>
          }
          createMany: {
            args: Prisma.AttendeeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AttendeeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendeePayload>
          }
          update: {
            args: Prisma.AttendeeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendeePayload>
          }
          deleteMany: {
            args: Prisma.AttendeeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AttendeeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AttendeeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendeePayload>
          }
          aggregate: {
            args: Prisma.AttendeeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAttendee>
          }
          groupBy: {
            args: Prisma.AttendeeGroupByArgs<ExtArgs>
            result: $Utils.Optional<AttendeeGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.AttendeeFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.AttendeeAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.AttendeeCountArgs<ExtArgs>
            result: $Utils.Optional<AttendeeCountAggregateOutputType> | number
          }
        }
      }
      SeatAllocation: {
        payload: Prisma.$SeatAllocationPayload<ExtArgs>
        fields: Prisma.SeatAllocationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SeatAllocationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatAllocationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SeatAllocationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatAllocationPayload>
          }
          findFirst: {
            args: Prisma.SeatAllocationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatAllocationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SeatAllocationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatAllocationPayload>
          }
          findMany: {
            args: Prisma.SeatAllocationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatAllocationPayload>[]
          }
          create: {
            args: Prisma.SeatAllocationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatAllocationPayload>
          }
          createMany: {
            args: Prisma.SeatAllocationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SeatAllocationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatAllocationPayload>
          }
          update: {
            args: Prisma.SeatAllocationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatAllocationPayload>
          }
          deleteMany: {
            args: Prisma.SeatAllocationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SeatAllocationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SeatAllocationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatAllocationPayload>
          }
          aggregate: {
            args: Prisma.SeatAllocationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSeatAllocation>
          }
          groupBy: {
            args: Prisma.SeatAllocationGroupByArgs<ExtArgs>
            result: $Utils.Optional<SeatAllocationGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.SeatAllocationFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.SeatAllocationAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.SeatAllocationCountArgs<ExtArgs>
            result: $Utils.Optional<SeatAllocationCountAggregateOutputType> | number
          }
        }
      }
      Enclosure: {
        payload: Prisma.$EnclosurePayload<ExtArgs>
        fields: Prisma.EnclosureFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EnclosureFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnclosurePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EnclosureFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnclosurePayload>
          }
          findFirst: {
            args: Prisma.EnclosureFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnclosurePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EnclosureFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnclosurePayload>
          }
          findMany: {
            args: Prisma.EnclosureFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnclosurePayload>[]
          }
          create: {
            args: Prisma.EnclosureCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnclosurePayload>
          }
          createMany: {
            args: Prisma.EnclosureCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.EnclosureDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnclosurePayload>
          }
          update: {
            args: Prisma.EnclosureUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnclosurePayload>
          }
          deleteMany: {
            args: Prisma.EnclosureDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EnclosureUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EnclosureUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnclosurePayload>
          }
          aggregate: {
            args: Prisma.EnclosureAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEnclosure>
          }
          groupBy: {
            args: Prisma.EnclosureGroupByArgs<ExtArgs>
            result: $Utils.Optional<EnclosureGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.EnclosureFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.EnclosureAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.EnclosureCountArgs<ExtArgs>
            result: $Utils.Optional<EnclosureCountAggregateOutputType> | number
          }
        }
      }
      Row: {
        payload: Prisma.$RowPayload<ExtArgs>
        fields: Prisma.RowFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RowFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RowPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RowFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RowPayload>
          }
          findFirst: {
            args: Prisma.RowFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RowPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RowFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RowPayload>
          }
          findMany: {
            args: Prisma.RowFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RowPayload>[]
          }
          create: {
            args: Prisma.RowCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RowPayload>
          }
          createMany: {
            args: Prisma.RowCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.RowDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RowPayload>
          }
          update: {
            args: Prisma.RowUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RowPayload>
          }
          deleteMany: {
            args: Prisma.RowDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RowUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RowUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RowPayload>
          }
          aggregate: {
            args: Prisma.RowAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRow>
          }
          groupBy: {
            args: Prisma.RowGroupByArgs<ExtArgs>
            result: $Utils.Optional<RowGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.RowFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.RowAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.RowCountArgs<ExtArgs>
            result: $Utils.Optional<RowCountAggregateOutputType> | number
          }
        }
      }
      Analytics: {
        payload: Prisma.$AnalyticsPayload<ExtArgs>
        fields: Prisma.AnalyticsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnalyticsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnalyticsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload>
          }
          findFirst: {
            args: Prisma.AnalyticsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnalyticsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload>
          }
          findMany: {
            args: Prisma.AnalyticsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload>[]
          }
          create: {
            args: Prisma.AnalyticsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload>
          }
          createMany: {
            args: Prisma.AnalyticsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AnalyticsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload>
          }
          update: {
            args: Prisma.AnalyticsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload>
          }
          deleteMany: {
            args: Prisma.AnalyticsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnalyticsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AnalyticsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload>
          }
          aggregate: {
            args: Prisma.AnalyticsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnalytics>
          }
          groupBy: {
            args: Prisma.AnalyticsGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnalyticsGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.AnalyticsFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.AnalyticsAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.AnalyticsCountArgs<ExtArgs>
            result: $Utils.Optional<AnalyticsCountAggregateOutputType> | number
          }
        }
      }
      IAMPolicy: {
        payload: Prisma.$IAMPolicyPayload<ExtArgs>
        fields: Prisma.IAMPolicyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IAMPolicyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IAMPolicyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IAMPolicyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IAMPolicyPayload>
          }
          findFirst: {
            args: Prisma.IAMPolicyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IAMPolicyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IAMPolicyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IAMPolicyPayload>
          }
          findMany: {
            args: Prisma.IAMPolicyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IAMPolicyPayload>[]
          }
          create: {
            args: Prisma.IAMPolicyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IAMPolicyPayload>
          }
          createMany: {
            args: Prisma.IAMPolicyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.IAMPolicyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IAMPolicyPayload>
          }
          update: {
            args: Prisma.IAMPolicyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IAMPolicyPayload>
          }
          deleteMany: {
            args: Prisma.IAMPolicyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IAMPolicyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.IAMPolicyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IAMPolicyPayload>
          }
          aggregate: {
            args: Prisma.IAMPolicyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIAMPolicy>
          }
          groupBy: {
            args: Prisma.IAMPolicyGroupByArgs<ExtArgs>
            result: $Utils.Optional<IAMPolicyGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.IAMPolicyFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.IAMPolicyAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.IAMPolicyCountArgs<ExtArgs>
            result: $Utils.Optional<IAMPolicyCountAggregateOutputType> | number
          }
        }
      }
      Department: {
        payload: Prisma.$DepartmentPayload<ExtArgs>
        fields: Prisma.DepartmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DepartmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DepartmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          findFirst: {
            args: Prisma.DepartmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DepartmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          findMany: {
            args: Prisma.DepartmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>[]
          }
          create: {
            args: Prisma.DepartmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          createMany: {
            args: Prisma.DepartmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.DepartmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          update: {
            args: Prisma.DepartmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          deleteMany: {
            args: Prisma.DepartmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DepartmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DepartmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          aggregate: {
            args: Prisma.DepartmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDepartment>
          }
          groupBy: {
            args: Prisma.DepartmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<DepartmentGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.DepartmentFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.DepartmentAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.DepartmentCountArgs<ExtArgs>
            result: $Utils.Optional<DepartmentCountAggregateOutputType> | number
          }
        }
      }
      Convocation: {
        payload: Prisma.$ConvocationPayload<ExtArgs>
        fields: Prisma.ConvocationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConvocationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConvocationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConvocationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConvocationPayload>
          }
          findFirst: {
            args: Prisma.ConvocationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConvocationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConvocationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConvocationPayload>
          }
          findMany: {
            args: Prisma.ConvocationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConvocationPayload>[]
          }
          create: {
            args: Prisma.ConvocationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConvocationPayload>
          }
          createMany: {
            args: Prisma.ConvocationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ConvocationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConvocationPayload>
          }
          update: {
            args: Prisma.ConvocationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConvocationPayload>
          }
          deleteMany: {
            args: Prisma.ConvocationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConvocationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ConvocationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConvocationPayload>
          }
          aggregate: {
            args: Prisma.ConvocationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConvocation>
          }
          groupBy: {
            args: Prisma.ConvocationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConvocationGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.ConvocationFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.ConvocationAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.ConvocationCountArgs<ExtArgs>
            result: $Utils.Optional<ConvocationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $runCommandRaw: {
          args: Prisma.InputJsonObject,
          result: Prisma.JsonObject
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    account?: AccountOmit
    attendee?: AttendeeOmit
    seatAllocation?: SeatAllocationOmit
    enclosure?: EnclosureOmit
    row?: RowOmit
    analytics?: AnalyticsOmit
    iAMPolicy?: IAMPolicyOmit
    department?: DepartmentOmit
    convocation?: ConvocationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type AccountCountOutputType
   */

  export type AccountCountOutputType = {
    attendees: number
  }

  export type AccountCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attendees?: boolean | AccountCountOutputTypeCountAttendeesArgs
  }

  // Custom InputTypes
  /**
   * AccountCountOutputType without action
   */
  export type AccountCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountCountOutputType
     */
    select?: AccountCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AccountCountOutputType without action
   */
  export type AccountCountOutputTypeCountAttendeesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AttendeeWhereInput
  }


  /**
   * Count Type EnclosureCountOutputType
   */

  export type EnclosureCountOutputType = {
    rows: number
  }

  export type EnclosureCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rows?: boolean | EnclosureCountOutputTypeCountRowsArgs
  }

  // Custom InputTypes
  /**
   * EnclosureCountOutputType without action
   */
  export type EnclosureCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnclosureCountOutputType
     */
    select?: EnclosureCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EnclosureCountOutputType without action
   */
  export type EnclosureCountOutputTypeCountRowsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RowWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    firstName: string | null
    lastName: string | null
    displayName: string | null
    profileImageURL: string | null
    role: $Enums.UserRole | null
    accountState: $Enums.AccountState | null
    isActive: boolean | null
    lastLoginAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    firstName: string | null
    lastName: string | null
    displayName: string | null
    profileImageURL: string | null
    role: $Enums.UserRole | null
    accountState: $Enums.AccountState | null
    isActive: boolean | null
    lastLoginAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    email: number
    password: number
    firstName: number
    lastName: number
    displayName: number
    profileImageURL: number
    role: number
    assignedIAMPolicies: number
    accountState: number
    isActive: number
    lastLoginAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccountMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    firstName?: true
    lastName?: true
    displayName?: true
    profileImageURL?: true
    role?: true
    accountState?: true
    isActive?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    firstName?: true
    lastName?: true
    displayName?: true
    profileImageURL?: true
    role?: true
    accountState?: true
    isActive?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    firstName?: true
    lastName?: true
    displayName?: true
    profileImageURL?: true
    role?: true
    assignedIAMPolicies?: true
    accountState?: true
    isActive?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    email: string
    password: string
    firstName: string
    lastName: string
    displayName: string
    profileImageURL: string | null
    role: $Enums.UserRole
    assignedIAMPolicies: string[]
    accountState: $Enums.AccountState
    isActive: boolean
    lastLoginAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    firstName?: boolean
    lastName?: boolean
    displayName?: boolean
    profileImageURL?: boolean
    role?: boolean
    assignedIAMPolicies?: boolean
    accountState?: boolean
    isActive?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    attendees?: boolean | Account$attendeesArgs<ExtArgs>
    _count?: boolean | AccountCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>



  export type AccountSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    firstName?: boolean
    lastName?: boolean
    displayName?: boolean
    profileImageURL?: boolean
    role?: boolean
    assignedIAMPolicies?: boolean
    accountState?: boolean
    isActive?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password" | "firstName" | "lastName" | "displayName" | "profileImageURL" | "role" | "assignedIAMPolicies" | "accountState" | "isActive" | "lastLoginAt" | "createdAt" | "updatedAt", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attendees?: boolean | Account$attendeesArgs<ExtArgs>
    _count?: boolean | AccountCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      attendees: Prisma.$AttendeePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string
      firstName: string
      lastName: string
      displayName: string
      profileImageURL: string | null
      role: $Enums.UserRole
      assignedIAMPolicies: string[]
      accountState: $Enums.AccountState
      isActive: boolean
      lastLoginAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * @param {AccountFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const account = await prisma.account.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: AccountFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Account.
     * @param {AccountAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const account = await prisma.account.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: AccountAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    attendees<T extends Account$attendeesArgs<ExtArgs> = {}>(args?: Subset<T, Account$attendeesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AttendeePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly email: FieldRef<"Account", 'String'>
    readonly password: FieldRef<"Account", 'String'>
    readonly firstName: FieldRef<"Account", 'String'>
    readonly lastName: FieldRef<"Account", 'String'>
    readonly displayName: FieldRef<"Account", 'String'>
    readonly profileImageURL: FieldRef<"Account", 'String'>
    readonly role: FieldRef<"Account", 'UserRole'>
    readonly assignedIAMPolicies: FieldRef<"Account", 'String[]'>
    readonly accountState: FieldRef<"Account", 'AccountState'>
    readonly isActive: FieldRef<"Account", 'Boolean'>
    readonly lastLoginAt: FieldRef<"Account", 'DateTime'>
    readonly createdAt: FieldRef<"Account", 'DateTime'>
    readonly updatedAt: FieldRef<"Account", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account findRaw
   */
  export type AccountFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Account aggregateRaw
   */
  export type AccountAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Account.attendees
   */
  export type Account$attendeesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendee
     */
    select?: AttendeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Attendee
     */
    omit?: AttendeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendeeInclude<ExtArgs> | null
    where?: AttendeeWhereInput
    orderBy?: AttendeeOrderByWithRelationInput | AttendeeOrderByWithRelationInput[]
    cursor?: AttendeeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AttendeeScalarFieldEnum | AttendeeScalarFieldEnum[]
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Attendee
   */

  export type AggregateAttendee = {
    _count: AttendeeCountAggregateOutputType | null
    _min: AttendeeMinAggregateOutputType | null
    _max: AttendeeMaxAggregateOutputType | null
  }

  export type AttendeeMinAggregateOutputType = {
    id: string | null
    enrollmentId: string | null
    name: string | null
    course: string | null
    school: string | null
    degree: string | null
    email: string | null
    phone: string | null
    convocationEligible: boolean | null
    convocationRegistered: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    crr: string | null
    enclosure: string | null
    accountId: string | null
  }

  export type AttendeeMaxAggregateOutputType = {
    id: string | null
    enrollmentId: string | null
    name: string | null
    course: string | null
    school: string | null
    degree: string | null
    email: string | null
    phone: string | null
    convocationEligible: boolean | null
    convocationRegistered: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    crr: string | null
    enclosure: string | null
    accountId: string | null
  }

  export type AttendeeCountAggregateOutputType = {
    id: number
    enrollmentId: number
    name: number
    course: number
    school: number
    degree: number
    email: number
    phone: number
    convocationEligible: number
    convocationRegistered: number
    createdAt: number
    updatedAt: number
    crr: number
    enclosure: number
    accountId: number
    _all: number
  }


  export type AttendeeMinAggregateInputType = {
    id?: true
    enrollmentId?: true
    name?: true
    course?: true
    school?: true
    degree?: true
    email?: true
    phone?: true
    convocationEligible?: true
    convocationRegistered?: true
    createdAt?: true
    updatedAt?: true
    crr?: true
    enclosure?: true
    accountId?: true
  }

  export type AttendeeMaxAggregateInputType = {
    id?: true
    enrollmentId?: true
    name?: true
    course?: true
    school?: true
    degree?: true
    email?: true
    phone?: true
    convocationEligible?: true
    convocationRegistered?: true
    createdAt?: true
    updatedAt?: true
    crr?: true
    enclosure?: true
    accountId?: true
  }

  export type AttendeeCountAggregateInputType = {
    id?: true
    enrollmentId?: true
    name?: true
    course?: true
    school?: true
    degree?: true
    email?: true
    phone?: true
    convocationEligible?: true
    convocationRegistered?: true
    createdAt?: true
    updatedAt?: true
    crr?: true
    enclosure?: true
    accountId?: true
    _all?: true
  }

  export type AttendeeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Attendee to aggregate.
     */
    where?: AttendeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Attendees to fetch.
     */
    orderBy?: AttendeeOrderByWithRelationInput | AttendeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AttendeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Attendees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Attendees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Attendees
    **/
    _count?: true | AttendeeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AttendeeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AttendeeMaxAggregateInputType
  }

  export type GetAttendeeAggregateType<T extends AttendeeAggregateArgs> = {
        [P in keyof T & keyof AggregateAttendee]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAttendee[P]>
      : GetScalarType<T[P], AggregateAttendee[P]>
  }




  export type AttendeeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AttendeeWhereInput
    orderBy?: AttendeeOrderByWithAggregationInput | AttendeeOrderByWithAggregationInput[]
    by: AttendeeScalarFieldEnum[] | AttendeeScalarFieldEnum
    having?: AttendeeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AttendeeCountAggregateInputType | true
    _min?: AttendeeMinAggregateInputType
    _max?: AttendeeMaxAggregateInputType
  }

  export type AttendeeGroupByOutputType = {
    id: string
    enrollmentId: string
    name: string
    course: string
    school: string
    degree: string
    email: string | null
    phone: string | null
    convocationEligible: boolean
    convocationRegistered: boolean
    createdAt: Date
    updatedAt: Date
    crr: string
    enclosure: string
    accountId: string | null
    _count: AttendeeCountAggregateOutputType | null
    _min: AttendeeMinAggregateOutputType | null
    _max: AttendeeMaxAggregateOutputType | null
  }

  type GetAttendeeGroupByPayload<T extends AttendeeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AttendeeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AttendeeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AttendeeGroupByOutputType[P]>
            : GetScalarType<T[P], AttendeeGroupByOutputType[P]>
        }
      >
    >


  export type AttendeeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    enrollmentId?: boolean
    name?: boolean
    course?: boolean
    school?: boolean
    degree?: boolean
    email?: boolean
    phone?: boolean
    convocationEligible?: boolean
    convocationRegistered?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    crr?: boolean
    enclosure?: boolean
    accountId?: boolean
    account?: boolean | Attendee$accountArgs<ExtArgs>
    allocation?: boolean | Attendee$allocationArgs<ExtArgs>
  }, ExtArgs["result"]["attendee"]>



  export type AttendeeSelectScalar = {
    id?: boolean
    enrollmentId?: boolean
    name?: boolean
    course?: boolean
    school?: boolean
    degree?: boolean
    email?: boolean
    phone?: boolean
    convocationEligible?: boolean
    convocationRegistered?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    crr?: boolean
    enclosure?: boolean
    accountId?: boolean
  }

  export type AttendeeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "enrollmentId" | "name" | "course" | "school" | "degree" | "email" | "phone" | "convocationEligible" | "convocationRegistered" | "createdAt" | "updatedAt" | "crr" | "enclosure" | "accountId", ExtArgs["result"]["attendee"]>
  export type AttendeeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | Attendee$accountArgs<ExtArgs>
    allocation?: boolean | Attendee$allocationArgs<ExtArgs>
  }

  export type $AttendeePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Attendee"
    objects: {
      account: Prisma.$AccountPayload<ExtArgs> | null
      allocation: Prisma.$SeatAllocationPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      enrollmentId: string
      name: string
      course: string
      school: string
      degree: string
      email: string | null
      phone: string | null
      convocationEligible: boolean
      convocationRegistered: boolean
      createdAt: Date
      updatedAt: Date
      crr: string
      enclosure: string
      accountId: string | null
    }, ExtArgs["result"]["attendee"]>
    composites: {}
  }

  type AttendeeGetPayload<S extends boolean | null | undefined | AttendeeDefaultArgs> = $Result.GetResult<Prisma.$AttendeePayload, S>

  type AttendeeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AttendeeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AttendeeCountAggregateInputType | true
    }

  export interface AttendeeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Attendee'], meta: { name: 'Attendee' } }
    /**
     * Find zero or one Attendee that matches the filter.
     * @param {AttendeeFindUniqueArgs} args - Arguments to find a Attendee
     * @example
     * // Get one Attendee
     * const attendee = await prisma.attendee.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AttendeeFindUniqueArgs>(args: SelectSubset<T, AttendeeFindUniqueArgs<ExtArgs>>): Prisma__AttendeeClient<$Result.GetResult<Prisma.$AttendeePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Attendee that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AttendeeFindUniqueOrThrowArgs} args - Arguments to find a Attendee
     * @example
     * // Get one Attendee
     * const attendee = await prisma.attendee.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AttendeeFindUniqueOrThrowArgs>(args: SelectSubset<T, AttendeeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AttendeeClient<$Result.GetResult<Prisma.$AttendeePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Attendee that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendeeFindFirstArgs} args - Arguments to find a Attendee
     * @example
     * // Get one Attendee
     * const attendee = await prisma.attendee.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AttendeeFindFirstArgs>(args?: SelectSubset<T, AttendeeFindFirstArgs<ExtArgs>>): Prisma__AttendeeClient<$Result.GetResult<Prisma.$AttendeePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Attendee that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendeeFindFirstOrThrowArgs} args - Arguments to find a Attendee
     * @example
     * // Get one Attendee
     * const attendee = await prisma.attendee.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AttendeeFindFirstOrThrowArgs>(args?: SelectSubset<T, AttendeeFindFirstOrThrowArgs<ExtArgs>>): Prisma__AttendeeClient<$Result.GetResult<Prisma.$AttendeePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Attendees that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendeeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Attendees
     * const attendees = await prisma.attendee.findMany()
     * 
     * // Get first 10 Attendees
     * const attendees = await prisma.attendee.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const attendeeWithIdOnly = await prisma.attendee.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AttendeeFindManyArgs>(args?: SelectSubset<T, AttendeeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AttendeePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Attendee.
     * @param {AttendeeCreateArgs} args - Arguments to create a Attendee.
     * @example
     * // Create one Attendee
     * const Attendee = await prisma.attendee.create({
     *   data: {
     *     // ... data to create a Attendee
     *   }
     * })
     * 
     */
    create<T extends AttendeeCreateArgs>(args: SelectSubset<T, AttendeeCreateArgs<ExtArgs>>): Prisma__AttendeeClient<$Result.GetResult<Prisma.$AttendeePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Attendees.
     * @param {AttendeeCreateManyArgs} args - Arguments to create many Attendees.
     * @example
     * // Create many Attendees
     * const attendee = await prisma.attendee.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AttendeeCreateManyArgs>(args?: SelectSubset<T, AttendeeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Attendee.
     * @param {AttendeeDeleteArgs} args - Arguments to delete one Attendee.
     * @example
     * // Delete one Attendee
     * const Attendee = await prisma.attendee.delete({
     *   where: {
     *     // ... filter to delete one Attendee
     *   }
     * })
     * 
     */
    delete<T extends AttendeeDeleteArgs>(args: SelectSubset<T, AttendeeDeleteArgs<ExtArgs>>): Prisma__AttendeeClient<$Result.GetResult<Prisma.$AttendeePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Attendee.
     * @param {AttendeeUpdateArgs} args - Arguments to update one Attendee.
     * @example
     * // Update one Attendee
     * const attendee = await prisma.attendee.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AttendeeUpdateArgs>(args: SelectSubset<T, AttendeeUpdateArgs<ExtArgs>>): Prisma__AttendeeClient<$Result.GetResult<Prisma.$AttendeePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Attendees.
     * @param {AttendeeDeleteManyArgs} args - Arguments to filter Attendees to delete.
     * @example
     * // Delete a few Attendees
     * const { count } = await prisma.attendee.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AttendeeDeleteManyArgs>(args?: SelectSubset<T, AttendeeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Attendees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendeeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Attendees
     * const attendee = await prisma.attendee.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AttendeeUpdateManyArgs>(args: SelectSubset<T, AttendeeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Attendee.
     * @param {AttendeeUpsertArgs} args - Arguments to update or create a Attendee.
     * @example
     * // Update or create a Attendee
     * const attendee = await prisma.attendee.upsert({
     *   create: {
     *     // ... data to create a Attendee
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Attendee we want to update
     *   }
     * })
     */
    upsert<T extends AttendeeUpsertArgs>(args: SelectSubset<T, AttendeeUpsertArgs<ExtArgs>>): Prisma__AttendeeClient<$Result.GetResult<Prisma.$AttendeePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Attendees that matches the filter.
     * @param {AttendeeFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const attendee = await prisma.attendee.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: AttendeeFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Attendee.
     * @param {AttendeeAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const attendee = await prisma.attendee.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: AttendeeAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Attendees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendeeCountArgs} args - Arguments to filter Attendees to count.
     * @example
     * // Count the number of Attendees
     * const count = await prisma.attendee.count({
     *   where: {
     *     // ... the filter for the Attendees we want to count
     *   }
     * })
    **/
    count<T extends AttendeeCountArgs>(
      args?: Subset<T, AttendeeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AttendeeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Attendee.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendeeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AttendeeAggregateArgs>(args: Subset<T, AttendeeAggregateArgs>): Prisma.PrismaPromise<GetAttendeeAggregateType<T>>

    /**
     * Group by Attendee.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendeeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AttendeeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AttendeeGroupByArgs['orderBy'] }
        : { orderBy?: AttendeeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AttendeeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAttendeeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Attendee model
   */
  readonly fields: AttendeeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Attendee.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AttendeeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    account<T extends Attendee$accountArgs<ExtArgs> = {}>(args?: Subset<T, Attendee$accountArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    allocation<T extends Attendee$allocationArgs<ExtArgs> = {}>(args?: Subset<T, Attendee$allocationArgs<ExtArgs>>): Prisma__SeatAllocationClient<$Result.GetResult<Prisma.$SeatAllocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Attendee model
   */
  interface AttendeeFieldRefs {
    readonly id: FieldRef<"Attendee", 'String'>
    readonly enrollmentId: FieldRef<"Attendee", 'String'>
    readonly name: FieldRef<"Attendee", 'String'>
    readonly course: FieldRef<"Attendee", 'String'>
    readonly school: FieldRef<"Attendee", 'String'>
    readonly degree: FieldRef<"Attendee", 'String'>
    readonly email: FieldRef<"Attendee", 'String'>
    readonly phone: FieldRef<"Attendee", 'String'>
    readonly convocationEligible: FieldRef<"Attendee", 'Boolean'>
    readonly convocationRegistered: FieldRef<"Attendee", 'Boolean'>
    readonly createdAt: FieldRef<"Attendee", 'DateTime'>
    readonly updatedAt: FieldRef<"Attendee", 'DateTime'>
    readonly crr: FieldRef<"Attendee", 'String'>
    readonly enclosure: FieldRef<"Attendee", 'String'>
    readonly accountId: FieldRef<"Attendee", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Attendee findUnique
   */
  export type AttendeeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendee
     */
    select?: AttendeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Attendee
     */
    omit?: AttendeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendeeInclude<ExtArgs> | null
    /**
     * Filter, which Attendee to fetch.
     */
    where: AttendeeWhereUniqueInput
  }

  /**
   * Attendee findUniqueOrThrow
   */
  export type AttendeeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendee
     */
    select?: AttendeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Attendee
     */
    omit?: AttendeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendeeInclude<ExtArgs> | null
    /**
     * Filter, which Attendee to fetch.
     */
    where: AttendeeWhereUniqueInput
  }

  /**
   * Attendee findFirst
   */
  export type AttendeeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendee
     */
    select?: AttendeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Attendee
     */
    omit?: AttendeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendeeInclude<ExtArgs> | null
    /**
     * Filter, which Attendee to fetch.
     */
    where?: AttendeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Attendees to fetch.
     */
    orderBy?: AttendeeOrderByWithRelationInput | AttendeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Attendees.
     */
    cursor?: AttendeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Attendees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Attendees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Attendees.
     */
    distinct?: AttendeeScalarFieldEnum | AttendeeScalarFieldEnum[]
  }

  /**
   * Attendee findFirstOrThrow
   */
  export type AttendeeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendee
     */
    select?: AttendeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Attendee
     */
    omit?: AttendeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendeeInclude<ExtArgs> | null
    /**
     * Filter, which Attendee to fetch.
     */
    where?: AttendeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Attendees to fetch.
     */
    orderBy?: AttendeeOrderByWithRelationInput | AttendeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Attendees.
     */
    cursor?: AttendeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Attendees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Attendees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Attendees.
     */
    distinct?: AttendeeScalarFieldEnum | AttendeeScalarFieldEnum[]
  }

  /**
   * Attendee findMany
   */
  export type AttendeeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendee
     */
    select?: AttendeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Attendee
     */
    omit?: AttendeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendeeInclude<ExtArgs> | null
    /**
     * Filter, which Attendees to fetch.
     */
    where?: AttendeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Attendees to fetch.
     */
    orderBy?: AttendeeOrderByWithRelationInput | AttendeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Attendees.
     */
    cursor?: AttendeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Attendees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Attendees.
     */
    skip?: number
    distinct?: AttendeeScalarFieldEnum | AttendeeScalarFieldEnum[]
  }

  /**
   * Attendee create
   */
  export type AttendeeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendee
     */
    select?: AttendeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Attendee
     */
    omit?: AttendeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendeeInclude<ExtArgs> | null
    /**
     * The data needed to create a Attendee.
     */
    data: XOR<AttendeeCreateInput, AttendeeUncheckedCreateInput>
  }

  /**
   * Attendee createMany
   */
  export type AttendeeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Attendees.
     */
    data: AttendeeCreateManyInput | AttendeeCreateManyInput[]
  }

  /**
   * Attendee update
   */
  export type AttendeeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendee
     */
    select?: AttendeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Attendee
     */
    omit?: AttendeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendeeInclude<ExtArgs> | null
    /**
     * The data needed to update a Attendee.
     */
    data: XOR<AttendeeUpdateInput, AttendeeUncheckedUpdateInput>
    /**
     * Choose, which Attendee to update.
     */
    where: AttendeeWhereUniqueInput
  }

  /**
   * Attendee updateMany
   */
  export type AttendeeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Attendees.
     */
    data: XOR<AttendeeUpdateManyMutationInput, AttendeeUncheckedUpdateManyInput>
    /**
     * Filter which Attendees to update
     */
    where?: AttendeeWhereInput
    /**
     * Limit how many Attendees to update.
     */
    limit?: number
  }

  /**
   * Attendee upsert
   */
  export type AttendeeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendee
     */
    select?: AttendeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Attendee
     */
    omit?: AttendeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendeeInclude<ExtArgs> | null
    /**
     * The filter to search for the Attendee to update in case it exists.
     */
    where: AttendeeWhereUniqueInput
    /**
     * In case the Attendee found by the `where` argument doesn't exist, create a new Attendee with this data.
     */
    create: XOR<AttendeeCreateInput, AttendeeUncheckedCreateInput>
    /**
     * In case the Attendee was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AttendeeUpdateInput, AttendeeUncheckedUpdateInput>
  }

  /**
   * Attendee delete
   */
  export type AttendeeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendee
     */
    select?: AttendeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Attendee
     */
    omit?: AttendeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendeeInclude<ExtArgs> | null
    /**
     * Filter which Attendee to delete.
     */
    where: AttendeeWhereUniqueInput
  }

  /**
   * Attendee deleteMany
   */
  export type AttendeeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Attendees to delete
     */
    where?: AttendeeWhereInput
    /**
     * Limit how many Attendees to delete.
     */
    limit?: number
  }

  /**
   * Attendee findRaw
   */
  export type AttendeeFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Attendee aggregateRaw
   */
  export type AttendeeAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Attendee.account
   */
  export type Attendee$accountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
  }

  /**
   * Attendee.allocation
   */
  export type Attendee$allocationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeatAllocation
     */
    select?: SeatAllocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeatAllocation
     */
    omit?: SeatAllocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatAllocationInclude<ExtArgs> | null
    where?: SeatAllocationWhereInput
  }

  /**
   * Attendee without action
   */
  export type AttendeeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendee
     */
    select?: AttendeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Attendee
     */
    omit?: AttendeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendeeInclude<ExtArgs> | null
  }


  /**
   * Model SeatAllocation
   */

  export type AggregateSeatAllocation = {
    _count: SeatAllocationCountAggregateOutputType | null
    _avg: SeatAllocationAvgAggregateOutputType | null
    _sum: SeatAllocationSumAggregateOutputType | null
    _min: SeatAllocationMinAggregateOutputType | null
    _max: SeatAllocationMaxAggregateOutputType | null
  }

  export type SeatAllocationAvgAggregateOutputType = {
    seat: number | null
  }

  export type SeatAllocationSumAggregateOutputType = {
    seat: number | null
  }

  export type SeatAllocationMinAggregateOutputType = {
    id: string | null
    enclosure: string | null
    row: string | null
    seat: number | null
    allocatedAt: Date | null
    attendeeId: string | null
  }

  export type SeatAllocationMaxAggregateOutputType = {
    id: string | null
    enclosure: string | null
    row: string | null
    seat: number | null
    allocatedAt: Date | null
    attendeeId: string | null
  }

  export type SeatAllocationCountAggregateOutputType = {
    id: number
    enclosure: number
    row: number
    seat: number
    allocatedAt: number
    attendeeId: number
    _all: number
  }


  export type SeatAllocationAvgAggregateInputType = {
    seat?: true
  }

  export type SeatAllocationSumAggregateInputType = {
    seat?: true
  }

  export type SeatAllocationMinAggregateInputType = {
    id?: true
    enclosure?: true
    row?: true
    seat?: true
    allocatedAt?: true
    attendeeId?: true
  }

  export type SeatAllocationMaxAggregateInputType = {
    id?: true
    enclosure?: true
    row?: true
    seat?: true
    allocatedAt?: true
    attendeeId?: true
  }

  export type SeatAllocationCountAggregateInputType = {
    id?: true
    enclosure?: true
    row?: true
    seat?: true
    allocatedAt?: true
    attendeeId?: true
    _all?: true
  }

  export type SeatAllocationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SeatAllocation to aggregate.
     */
    where?: SeatAllocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeatAllocations to fetch.
     */
    orderBy?: SeatAllocationOrderByWithRelationInput | SeatAllocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SeatAllocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeatAllocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeatAllocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SeatAllocations
    **/
    _count?: true | SeatAllocationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SeatAllocationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SeatAllocationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SeatAllocationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SeatAllocationMaxAggregateInputType
  }

  export type GetSeatAllocationAggregateType<T extends SeatAllocationAggregateArgs> = {
        [P in keyof T & keyof AggregateSeatAllocation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSeatAllocation[P]>
      : GetScalarType<T[P], AggregateSeatAllocation[P]>
  }




  export type SeatAllocationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SeatAllocationWhereInput
    orderBy?: SeatAllocationOrderByWithAggregationInput | SeatAllocationOrderByWithAggregationInput[]
    by: SeatAllocationScalarFieldEnum[] | SeatAllocationScalarFieldEnum
    having?: SeatAllocationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SeatAllocationCountAggregateInputType | true
    _avg?: SeatAllocationAvgAggregateInputType
    _sum?: SeatAllocationSumAggregateInputType
    _min?: SeatAllocationMinAggregateInputType
    _max?: SeatAllocationMaxAggregateInputType
  }

  export type SeatAllocationGroupByOutputType = {
    id: string
    enclosure: string
    row: string
    seat: number
    allocatedAt: Date
    attendeeId: string
    _count: SeatAllocationCountAggregateOutputType | null
    _avg: SeatAllocationAvgAggregateOutputType | null
    _sum: SeatAllocationSumAggregateOutputType | null
    _min: SeatAllocationMinAggregateOutputType | null
    _max: SeatAllocationMaxAggregateOutputType | null
  }

  type GetSeatAllocationGroupByPayload<T extends SeatAllocationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SeatAllocationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SeatAllocationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SeatAllocationGroupByOutputType[P]>
            : GetScalarType<T[P], SeatAllocationGroupByOutputType[P]>
        }
      >
    >


  export type SeatAllocationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    enclosure?: boolean
    row?: boolean
    seat?: boolean
    allocatedAt?: boolean
    attendeeId?: boolean
    attendee?: boolean | AttendeeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["seatAllocation"]>



  export type SeatAllocationSelectScalar = {
    id?: boolean
    enclosure?: boolean
    row?: boolean
    seat?: boolean
    allocatedAt?: boolean
    attendeeId?: boolean
  }

  export type SeatAllocationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "enclosure" | "row" | "seat" | "allocatedAt" | "attendeeId", ExtArgs["result"]["seatAllocation"]>
  export type SeatAllocationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attendee?: boolean | AttendeeDefaultArgs<ExtArgs>
  }

  export type $SeatAllocationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SeatAllocation"
    objects: {
      attendee: Prisma.$AttendeePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      enclosure: string
      row: string
      seat: number
      allocatedAt: Date
      attendeeId: string
    }, ExtArgs["result"]["seatAllocation"]>
    composites: {}
  }

  type SeatAllocationGetPayload<S extends boolean | null | undefined | SeatAllocationDefaultArgs> = $Result.GetResult<Prisma.$SeatAllocationPayload, S>

  type SeatAllocationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SeatAllocationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SeatAllocationCountAggregateInputType | true
    }

  export interface SeatAllocationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SeatAllocation'], meta: { name: 'SeatAllocation' } }
    /**
     * Find zero or one SeatAllocation that matches the filter.
     * @param {SeatAllocationFindUniqueArgs} args - Arguments to find a SeatAllocation
     * @example
     * // Get one SeatAllocation
     * const seatAllocation = await prisma.seatAllocation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SeatAllocationFindUniqueArgs>(args: SelectSubset<T, SeatAllocationFindUniqueArgs<ExtArgs>>): Prisma__SeatAllocationClient<$Result.GetResult<Prisma.$SeatAllocationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SeatAllocation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SeatAllocationFindUniqueOrThrowArgs} args - Arguments to find a SeatAllocation
     * @example
     * // Get one SeatAllocation
     * const seatAllocation = await prisma.seatAllocation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SeatAllocationFindUniqueOrThrowArgs>(args: SelectSubset<T, SeatAllocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SeatAllocationClient<$Result.GetResult<Prisma.$SeatAllocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SeatAllocation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeatAllocationFindFirstArgs} args - Arguments to find a SeatAllocation
     * @example
     * // Get one SeatAllocation
     * const seatAllocation = await prisma.seatAllocation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SeatAllocationFindFirstArgs>(args?: SelectSubset<T, SeatAllocationFindFirstArgs<ExtArgs>>): Prisma__SeatAllocationClient<$Result.GetResult<Prisma.$SeatAllocationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SeatAllocation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeatAllocationFindFirstOrThrowArgs} args - Arguments to find a SeatAllocation
     * @example
     * // Get one SeatAllocation
     * const seatAllocation = await prisma.seatAllocation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SeatAllocationFindFirstOrThrowArgs>(args?: SelectSubset<T, SeatAllocationFindFirstOrThrowArgs<ExtArgs>>): Prisma__SeatAllocationClient<$Result.GetResult<Prisma.$SeatAllocationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SeatAllocations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeatAllocationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SeatAllocations
     * const seatAllocations = await prisma.seatAllocation.findMany()
     * 
     * // Get first 10 SeatAllocations
     * const seatAllocations = await prisma.seatAllocation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const seatAllocationWithIdOnly = await prisma.seatAllocation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SeatAllocationFindManyArgs>(args?: SelectSubset<T, SeatAllocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeatAllocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SeatAllocation.
     * @param {SeatAllocationCreateArgs} args - Arguments to create a SeatAllocation.
     * @example
     * // Create one SeatAllocation
     * const SeatAllocation = await prisma.seatAllocation.create({
     *   data: {
     *     // ... data to create a SeatAllocation
     *   }
     * })
     * 
     */
    create<T extends SeatAllocationCreateArgs>(args: SelectSubset<T, SeatAllocationCreateArgs<ExtArgs>>): Prisma__SeatAllocationClient<$Result.GetResult<Prisma.$SeatAllocationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SeatAllocations.
     * @param {SeatAllocationCreateManyArgs} args - Arguments to create many SeatAllocations.
     * @example
     * // Create many SeatAllocations
     * const seatAllocation = await prisma.seatAllocation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SeatAllocationCreateManyArgs>(args?: SelectSubset<T, SeatAllocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a SeatAllocation.
     * @param {SeatAllocationDeleteArgs} args - Arguments to delete one SeatAllocation.
     * @example
     * // Delete one SeatAllocation
     * const SeatAllocation = await prisma.seatAllocation.delete({
     *   where: {
     *     // ... filter to delete one SeatAllocation
     *   }
     * })
     * 
     */
    delete<T extends SeatAllocationDeleteArgs>(args: SelectSubset<T, SeatAllocationDeleteArgs<ExtArgs>>): Prisma__SeatAllocationClient<$Result.GetResult<Prisma.$SeatAllocationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SeatAllocation.
     * @param {SeatAllocationUpdateArgs} args - Arguments to update one SeatAllocation.
     * @example
     * // Update one SeatAllocation
     * const seatAllocation = await prisma.seatAllocation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SeatAllocationUpdateArgs>(args: SelectSubset<T, SeatAllocationUpdateArgs<ExtArgs>>): Prisma__SeatAllocationClient<$Result.GetResult<Prisma.$SeatAllocationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SeatAllocations.
     * @param {SeatAllocationDeleteManyArgs} args - Arguments to filter SeatAllocations to delete.
     * @example
     * // Delete a few SeatAllocations
     * const { count } = await prisma.seatAllocation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SeatAllocationDeleteManyArgs>(args?: SelectSubset<T, SeatAllocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SeatAllocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeatAllocationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SeatAllocations
     * const seatAllocation = await prisma.seatAllocation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SeatAllocationUpdateManyArgs>(args: SelectSubset<T, SeatAllocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SeatAllocation.
     * @param {SeatAllocationUpsertArgs} args - Arguments to update or create a SeatAllocation.
     * @example
     * // Update or create a SeatAllocation
     * const seatAllocation = await prisma.seatAllocation.upsert({
     *   create: {
     *     // ... data to create a SeatAllocation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SeatAllocation we want to update
     *   }
     * })
     */
    upsert<T extends SeatAllocationUpsertArgs>(args: SelectSubset<T, SeatAllocationUpsertArgs<ExtArgs>>): Prisma__SeatAllocationClient<$Result.GetResult<Prisma.$SeatAllocationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SeatAllocations that matches the filter.
     * @param {SeatAllocationFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const seatAllocation = await prisma.seatAllocation.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: SeatAllocationFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a SeatAllocation.
     * @param {SeatAllocationAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const seatAllocation = await prisma.seatAllocation.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: SeatAllocationAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of SeatAllocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeatAllocationCountArgs} args - Arguments to filter SeatAllocations to count.
     * @example
     * // Count the number of SeatAllocations
     * const count = await prisma.seatAllocation.count({
     *   where: {
     *     // ... the filter for the SeatAllocations we want to count
     *   }
     * })
    **/
    count<T extends SeatAllocationCountArgs>(
      args?: Subset<T, SeatAllocationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SeatAllocationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SeatAllocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeatAllocationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SeatAllocationAggregateArgs>(args: Subset<T, SeatAllocationAggregateArgs>): Prisma.PrismaPromise<GetSeatAllocationAggregateType<T>>

    /**
     * Group by SeatAllocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeatAllocationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SeatAllocationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SeatAllocationGroupByArgs['orderBy'] }
        : { orderBy?: SeatAllocationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SeatAllocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSeatAllocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SeatAllocation model
   */
  readonly fields: SeatAllocationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SeatAllocation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SeatAllocationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    attendee<T extends AttendeeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AttendeeDefaultArgs<ExtArgs>>): Prisma__AttendeeClient<$Result.GetResult<Prisma.$AttendeePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SeatAllocation model
   */
  interface SeatAllocationFieldRefs {
    readonly id: FieldRef<"SeatAllocation", 'String'>
    readonly enclosure: FieldRef<"SeatAllocation", 'String'>
    readonly row: FieldRef<"SeatAllocation", 'String'>
    readonly seat: FieldRef<"SeatAllocation", 'Int'>
    readonly allocatedAt: FieldRef<"SeatAllocation", 'DateTime'>
    readonly attendeeId: FieldRef<"SeatAllocation", 'String'>
  }
    

  // Custom InputTypes
  /**
   * SeatAllocation findUnique
   */
  export type SeatAllocationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeatAllocation
     */
    select?: SeatAllocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeatAllocation
     */
    omit?: SeatAllocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatAllocationInclude<ExtArgs> | null
    /**
     * Filter, which SeatAllocation to fetch.
     */
    where: SeatAllocationWhereUniqueInput
  }

  /**
   * SeatAllocation findUniqueOrThrow
   */
  export type SeatAllocationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeatAllocation
     */
    select?: SeatAllocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeatAllocation
     */
    omit?: SeatAllocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatAllocationInclude<ExtArgs> | null
    /**
     * Filter, which SeatAllocation to fetch.
     */
    where: SeatAllocationWhereUniqueInput
  }

  /**
   * SeatAllocation findFirst
   */
  export type SeatAllocationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeatAllocation
     */
    select?: SeatAllocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeatAllocation
     */
    omit?: SeatAllocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatAllocationInclude<ExtArgs> | null
    /**
     * Filter, which SeatAllocation to fetch.
     */
    where?: SeatAllocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeatAllocations to fetch.
     */
    orderBy?: SeatAllocationOrderByWithRelationInput | SeatAllocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SeatAllocations.
     */
    cursor?: SeatAllocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeatAllocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeatAllocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SeatAllocations.
     */
    distinct?: SeatAllocationScalarFieldEnum | SeatAllocationScalarFieldEnum[]
  }

  /**
   * SeatAllocation findFirstOrThrow
   */
  export type SeatAllocationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeatAllocation
     */
    select?: SeatAllocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeatAllocation
     */
    omit?: SeatAllocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatAllocationInclude<ExtArgs> | null
    /**
     * Filter, which SeatAllocation to fetch.
     */
    where?: SeatAllocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeatAllocations to fetch.
     */
    orderBy?: SeatAllocationOrderByWithRelationInput | SeatAllocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SeatAllocations.
     */
    cursor?: SeatAllocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeatAllocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeatAllocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SeatAllocations.
     */
    distinct?: SeatAllocationScalarFieldEnum | SeatAllocationScalarFieldEnum[]
  }

  /**
   * SeatAllocation findMany
   */
  export type SeatAllocationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeatAllocation
     */
    select?: SeatAllocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeatAllocation
     */
    omit?: SeatAllocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatAllocationInclude<ExtArgs> | null
    /**
     * Filter, which SeatAllocations to fetch.
     */
    where?: SeatAllocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeatAllocations to fetch.
     */
    orderBy?: SeatAllocationOrderByWithRelationInput | SeatAllocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SeatAllocations.
     */
    cursor?: SeatAllocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeatAllocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeatAllocations.
     */
    skip?: number
    distinct?: SeatAllocationScalarFieldEnum | SeatAllocationScalarFieldEnum[]
  }

  /**
   * SeatAllocation create
   */
  export type SeatAllocationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeatAllocation
     */
    select?: SeatAllocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeatAllocation
     */
    omit?: SeatAllocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatAllocationInclude<ExtArgs> | null
    /**
     * The data needed to create a SeatAllocation.
     */
    data: XOR<SeatAllocationCreateInput, SeatAllocationUncheckedCreateInput>
  }

  /**
   * SeatAllocation createMany
   */
  export type SeatAllocationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SeatAllocations.
     */
    data: SeatAllocationCreateManyInput | SeatAllocationCreateManyInput[]
  }

  /**
   * SeatAllocation update
   */
  export type SeatAllocationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeatAllocation
     */
    select?: SeatAllocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeatAllocation
     */
    omit?: SeatAllocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatAllocationInclude<ExtArgs> | null
    /**
     * The data needed to update a SeatAllocation.
     */
    data: XOR<SeatAllocationUpdateInput, SeatAllocationUncheckedUpdateInput>
    /**
     * Choose, which SeatAllocation to update.
     */
    where: SeatAllocationWhereUniqueInput
  }

  /**
   * SeatAllocation updateMany
   */
  export type SeatAllocationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SeatAllocations.
     */
    data: XOR<SeatAllocationUpdateManyMutationInput, SeatAllocationUncheckedUpdateManyInput>
    /**
     * Filter which SeatAllocations to update
     */
    where?: SeatAllocationWhereInput
    /**
     * Limit how many SeatAllocations to update.
     */
    limit?: number
  }

  /**
   * SeatAllocation upsert
   */
  export type SeatAllocationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeatAllocation
     */
    select?: SeatAllocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeatAllocation
     */
    omit?: SeatAllocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatAllocationInclude<ExtArgs> | null
    /**
     * The filter to search for the SeatAllocation to update in case it exists.
     */
    where: SeatAllocationWhereUniqueInput
    /**
     * In case the SeatAllocation found by the `where` argument doesn't exist, create a new SeatAllocation with this data.
     */
    create: XOR<SeatAllocationCreateInput, SeatAllocationUncheckedCreateInput>
    /**
     * In case the SeatAllocation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SeatAllocationUpdateInput, SeatAllocationUncheckedUpdateInput>
  }

  /**
   * SeatAllocation delete
   */
  export type SeatAllocationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeatAllocation
     */
    select?: SeatAllocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeatAllocation
     */
    omit?: SeatAllocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatAllocationInclude<ExtArgs> | null
    /**
     * Filter which SeatAllocation to delete.
     */
    where: SeatAllocationWhereUniqueInput
  }

  /**
   * SeatAllocation deleteMany
   */
  export type SeatAllocationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SeatAllocations to delete
     */
    where?: SeatAllocationWhereInput
    /**
     * Limit how many SeatAllocations to delete.
     */
    limit?: number
  }

  /**
   * SeatAllocation findRaw
   */
  export type SeatAllocationFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * SeatAllocation aggregateRaw
   */
  export type SeatAllocationAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * SeatAllocation without action
   */
  export type SeatAllocationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeatAllocation
     */
    select?: SeatAllocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeatAllocation
     */
    omit?: SeatAllocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatAllocationInclude<ExtArgs> | null
  }


  /**
   * Model Enclosure
   */

  export type AggregateEnclosure = {
    _count: EnclosureCountAggregateOutputType | null
    _min: EnclosureMinAggregateOutputType | null
    _max: EnclosureMaxAggregateOutputType | null
  }

  export type EnclosureMinAggregateOutputType = {
    id: string | null
    letter: string | null
    allocatedFor: $Enums.EnclosureType | null
    entryDirection: $Enums.Direction | null
  }

  export type EnclosureMaxAggregateOutputType = {
    id: string | null
    letter: string | null
    allocatedFor: $Enums.EnclosureType | null
    entryDirection: $Enums.Direction | null
  }

  export type EnclosureCountAggregateOutputType = {
    id: number
    letter: number
    allocatedFor: number
    entryDirection: number
    _all: number
  }


  export type EnclosureMinAggregateInputType = {
    id?: true
    letter?: true
    allocatedFor?: true
    entryDirection?: true
  }

  export type EnclosureMaxAggregateInputType = {
    id?: true
    letter?: true
    allocatedFor?: true
    entryDirection?: true
  }

  export type EnclosureCountAggregateInputType = {
    id?: true
    letter?: true
    allocatedFor?: true
    entryDirection?: true
    _all?: true
  }

  export type EnclosureAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Enclosure to aggregate.
     */
    where?: EnclosureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Enclosures to fetch.
     */
    orderBy?: EnclosureOrderByWithRelationInput | EnclosureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EnclosureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Enclosures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Enclosures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Enclosures
    **/
    _count?: true | EnclosureCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EnclosureMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EnclosureMaxAggregateInputType
  }

  export type GetEnclosureAggregateType<T extends EnclosureAggregateArgs> = {
        [P in keyof T & keyof AggregateEnclosure]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEnclosure[P]>
      : GetScalarType<T[P], AggregateEnclosure[P]>
  }




  export type EnclosureGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EnclosureWhereInput
    orderBy?: EnclosureOrderByWithAggregationInput | EnclosureOrderByWithAggregationInput[]
    by: EnclosureScalarFieldEnum[] | EnclosureScalarFieldEnum
    having?: EnclosureScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EnclosureCountAggregateInputType | true
    _min?: EnclosureMinAggregateInputType
    _max?: EnclosureMaxAggregateInputType
  }

  export type EnclosureGroupByOutputType = {
    id: string
    letter: string
    allocatedFor: $Enums.EnclosureType
    entryDirection: $Enums.Direction
    _count: EnclosureCountAggregateOutputType | null
    _min: EnclosureMinAggregateOutputType | null
    _max: EnclosureMaxAggregateOutputType | null
  }

  type GetEnclosureGroupByPayload<T extends EnclosureGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EnclosureGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EnclosureGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EnclosureGroupByOutputType[P]>
            : GetScalarType<T[P], EnclosureGroupByOutputType[P]>
        }
      >
    >


  export type EnclosureSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    letter?: boolean
    allocatedFor?: boolean
    entryDirection?: boolean
    rows?: boolean | Enclosure$rowsArgs<ExtArgs>
    _count?: boolean | EnclosureCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["enclosure"]>



  export type EnclosureSelectScalar = {
    id?: boolean
    letter?: boolean
    allocatedFor?: boolean
    entryDirection?: boolean
  }

  export type EnclosureOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "letter" | "allocatedFor" | "entryDirection", ExtArgs["result"]["enclosure"]>
  export type EnclosureInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rows?: boolean | Enclosure$rowsArgs<ExtArgs>
    _count?: boolean | EnclosureCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $EnclosurePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Enclosure"
    objects: {
      rows: Prisma.$RowPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      letter: string
      allocatedFor: $Enums.EnclosureType
      entryDirection: $Enums.Direction
    }, ExtArgs["result"]["enclosure"]>
    composites: {}
  }

  type EnclosureGetPayload<S extends boolean | null | undefined | EnclosureDefaultArgs> = $Result.GetResult<Prisma.$EnclosurePayload, S>

  type EnclosureCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EnclosureFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EnclosureCountAggregateInputType | true
    }

  export interface EnclosureDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Enclosure'], meta: { name: 'Enclosure' } }
    /**
     * Find zero or one Enclosure that matches the filter.
     * @param {EnclosureFindUniqueArgs} args - Arguments to find a Enclosure
     * @example
     * // Get one Enclosure
     * const enclosure = await prisma.enclosure.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EnclosureFindUniqueArgs>(args: SelectSubset<T, EnclosureFindUniqueArgs<ExtArgs>>): Prisma__EnclosureClient<$Result.GetResult<Prisma.$EnclosurePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Enclosure that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EnclosureFindUniqueOrThrowArgs} args - Arguments to find a Enclosure
     * @example
     * // Get one Enclosure
     * const enclosure = await prisma.enclosure.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EnclosureFindUniqueOrThrowArgs>(args: SelectSubset<T, EnclosureFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EnclosureClient<$Result.GetResult<Prisma.$EnclosurePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Enclosure that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnclosureFindFirstArgs} args - Arguments to find a Enclosure
     * @example
     * // Get one Enclosure
     * const enclosure = await prisma.enclosure.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EnclosureFindFirstArgs>(args?: SelectSubset<T, EnclosureFindFirstArgs<ExtArgs>>): Prisma__EnclosureClient<$Result.GetResult<Prisma.$EnclosurePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Enclosure that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnclosureFindFirstOrThrowArgs} args - Arguments to find a Enclosure
     * @example
     * // Get one Enclosure
     * const enclosure = await prisma.enclosure.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EnclosureFindFirstOrThrowArgs>(args?: SelectSubset<T, EnclosureFindFirstOrThrowArgs<ExtArgs>>): Prisma__EnclosureClient<$Result.GetResult<Prisma.$EnclosurePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Enclosures that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnclosureFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Enclosures
     * const enclosures = await prisma.enclosure.findMany()
     * 
     * // Get first 10 Enclosures
     * const enclosures = await prisma.enclosure.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const enclosureWithIdOnly = await prisma.enclosure.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EnclosureFindManyArgs>(args?: SelectSubset<T, EnclosureFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnclosurePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Enclosure.
     * @param {EnclosureCreateArgs} args - Arguments to create a Enclosure.
     * @example
     * // Create one Enclosure
     * const Enclosure = await prisma.enclosure.create({
     *   data: {
     *     // ... data to create a Enclosure
     *   }
     * })
     * 
     */
    create<T extends EnclosureCreateArgs>(args: SelectSubset<T, EnclosureCreateArgs<ExtArgs>>): Prisma__EnclosureClient<$Result.GetResult<Prisma.$EnclosurePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Enclosures.
     * @param {EnclosureCreateManyArgs} args - Arguments to create many Enclosures.
     * @example
     * // Create many Enclosures
     * const enclosure = await prisma.enclosure.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EnclosureCreateManyArgs>(args?: SelectSubset<T, EnclosureCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Enclosure.
     * @param {EnclosureDeleteArgs} args - Arguments to delete one Enclosure.
     * @example
     * // Delete one Enclosure
     * const Enclosure = await prisma.enclosure.delete({
     *   where: {
     *     // ... filter to delete one Enclosure
     *   }
     * })
     * 
     */
    delete<T extends EnclosureDeleteArgs>(args: SelectSubset<T, EnclosureDeleteArgs<ExtArgs>>): Prisma__EnclosureClient<$Result.GetResult<Prisma.$EnclosurePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Enclosure.
     * @param {EnclosureUpdateArgs} args - Arguments to update one Enclosure.
     * @example
     * // Update one Enclosure
     * const enclosure = await prisma.enclosure.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EnclosureUpdateArgs>(args: SelectSubset<T, EnclosureUpdateArgs<ExtArgs>>): Prisma__EnclosureClient<$Result.GetResult<Prisma.$EnclosurePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Enclosures.
     * @param {EnclosureDeleteManyArgs} args - Arguments to filter Enclosures to delete.
     * @example
     * // Delete a few Enclosures
     * const { count } = await prisma.enclosure.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EnclosureDeleteManyArgs>(args?: SelectSubset<T, EnclosureDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Enclosures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnclosureUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Enclosures
     * const enclosure = await prisma.enclosure.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EnclosureUpdateManyArgs>(args: SelectSubset<T, EnclosureUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Enclosure.
     * @param {EnclosureUpsertArgs} args - Arguments to update or create a Enclosure.
     * @example
     * // Update or create a Enclosure
     * const enclosure = await prisma.enclosure.upsert({
     *   create: {
     *     // ... data to create a Enclosure
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Enclosure we want to update
     *   }
     * })
     */
    upsert<T extends EnclosureUpsertArgs>(args: SelectSubset<T, EnclosureUpsertArgs<ExtArgs>>): Prisma__EnclosureClient<$Result.GetResult<Prisma.$EnclosurePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Enclosures that matches the filter.
     * @param {EnclosureFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const enclosure = await prisma.enclosure.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: EnclosureFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Enclosure.
     * @param {EnclosureAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const enclosure = await prisma.enclosure.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: EnclosureAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Enclosures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnclosureCountArgs} args - Arguments to filter Enclosures to count.
     * @example
     * // Count the number of Enclosures
     * const count = await prisma.enclosure.count({
     *   where: {
     *     // ... the filter for the Enclosures we want to count
     *   }
     * })
    **/
    count<T extends EnclosureCountArgs>(
      args?: Subset<T, EnclosureCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EnclosureCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Enclosure.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnclosureAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EnclosureAggregateArgs>(args: Subset<T, EnclosureAggregateArgs>): Prisma.PrismaPromise<GetEnclosureAggregateType<T>>

    /**
     * Group by Enclosure.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnclosureGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EnclosureGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EnclosureGroupByArgs['orderBy'] }
        : { orderBy?: EnclosureGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EnclosureGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEnclosureGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Enclosure model
   */
  readonly fields: EnclosureFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Enclosure.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EnclosureClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    rows<T extends Enclosure$rowsArgs<ExtArgs> = {}>(args?: Subset<T, Enclosure$rowsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RowPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Enclosure model
   */
  interface EnclosureFieldRefs {
    readonly id: FieldRef<"Enclosure", 'String'>
    readonly letter: FieldRef<"Enclosure", 'String'>
    readonly allocatedFor: FieldRef<"Enclosure", 'EnclosureType'>
    readonly entryDirection: FieldRef<"Enclosure", 'Direction'>
  }
    

  // Custom InputTypes
  /**
   * Enclosure findUnique
   */
  export type EnclosureFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enclosure
     */
    select?: EnclosureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Enclosure
     */
    omit?: EnclosureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnclosureInclude<ExtArgs> | null
    /**
     * Filter, which Enclosure to fetch.
     */
    where: EnclosureWhereUniqueInput
  }

  /**
   * Enclosure findUniqueOrThrow
   */
  export type EnclosureFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enclosure
     */
    select?: EnclosureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Enclosure
     */
    omit?: EnclosureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnclosureInclude<ExtArgs> | null
    /**
     * Filter, which Enclosure to fetch.
     */
    where: EnclosureWhereUniqueInput
  }

  /**
   * Enclosure findFirst
   */
  export type EnclosureFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enclosure
     */
    select?: EnclosureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Enclosure
     */
    omit?: EnclosureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnclosureInclude<ExtArgs> | null
    /**
     * Filter, which Enclosure to fetch.
     */
    where?: EnclosureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Enclosures to fetch.
     */
    orderBy?: EnclosureOrderByWithRelationInput | EnclosureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Enclosures.
     */
    cursor?: EnclosureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Enclosures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Enclosures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Enclosures.
     */
    distinct?: EnclosureScalarFieldEnum | EnclosureScalarFieldEnum[]
  }

  /**
   * Enclosure findFirstOrThrow
   */
  export type EnclosureFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enclosure
     */
    select?: EnclosureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Enclosure
     */
    omit?: EnclosureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnclosureInclude<ExtArgs> | null
    /**
     * Filter, which Enclosure to fetch.
     */
    where?: EnclosureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Enclosures to fetch.
     */
    orderBy?: EnclosureOrderByWithRelationInput | EnclosureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Enclosures.
     */
    cursor?: EnclosureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Enclosures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Enclosures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Enclosures.
     */
    distinct?: EnclosureScalarFieldEnum | EnclosureScalarFieldEnum[]
  }

  /**
   * Enclosure findMany
   */
  export type EnclosureFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enclosure
     */
    select?: EnclosureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Enclosure
     */
    omit?: EnclosureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnclosureInclude<ExtArgs> | null
    /**
     * Filter, which Enclosures to fetch.
     */
    where?: EnclosureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Enclosures to fetch.
     */
    orderBy?: EnclosureOrderByWithRelationInput | EnclosureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Enclosures.
     */
    cursor?: EnclosureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Enclosures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Enclosures.
     */
    skip?: number
    distinct?: EnclosureScalarFieldEnum | EnclosureScalarFieldEnum[]
  }

  /**
   * Enclosure create
   */
  export type EnclosureCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enclosure
     */
    select?: EnclosureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Enclosure
     */
    omit?: EnclosureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnclosureInclude<ExtArgs> | null
    /**
     * The data needed to create a Enclosure.
     */
    data: XOR<EnclosureCreateInput, EnclosureUncheckedCreateInput>
  }

  /**
   * Enclosure createMany
   */
  export type EnclosureCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Enclosures.
     */
    data: EnclosureCreateManyInput | EnclosureCreateManyInput[]
  }

  /**
   * Enclosure update
   */
  export type EnclosureUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enclosure
     */
    select?: EnclosureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Enclosure
     */
    omit?: EnclosureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnclosureInclude<ExtArgs> | null
    /**
     * The data needed to update a Enclosure.
     */
    data: XOR<EnclosureUpdateInput, EnclosureUncheckedUpdateInput>
    /**
     * Choose, which Enclosure to update.
     */
    where: EnclosureWhereUniqueInput
  }

  /**
   * Enclosure updateMany
   */
  export type EnclosureUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Enclosures.
     */
    data: XOR<EnclosureUpdateManyMutationInput, EnclosureUncheckedUpdateManyInput>
    /**
     * Filter which Enclosures to update
     */
    where?: EnclosureWhereInput
    /**
     * Limit how many Enclosures to update.
     */
    limit?: number
  }

  /**
   * Enclosure upsert
   */
  export type EnclosureUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enclosure
     */
    select?: EnclosureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Enclosure
     */
    omit?: EnclosureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnclosureInclude<ExtArgs> | null
    /**
     * The filter to search for the Enclosure to update in case it exists.
     */
    where: EnclosureWhereUniqueInput
    /**
     * In case the Enclosure found by the `where` argument doesn't exist, create a new Enclosure with this data.
     */
    create: XOR<EnclosureCreateInput, EnclosureUncheckedCreateInput>
    /**
     * In case the Enclosure was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EnclosureUpdateInput, EnclosureUncheckedUpdateInput>
  }

  /**
   * Enclosure delete
   */
  export type EnclosureDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enclosure
     */
    select?: EnclosureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Enclosure
     */
    omit?: EnclosureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnclosureInclude<ExtArgs> | null
    /**
     * Filter which Enclosure to delete.
     */
    where: EnclosureWhereUniqueInput
  }

  /**
   * Enclosure deleteMany
   */
  export type EnclosureDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Enclosures to delete
     */
    where?: EnclosureWhereInput
    /**
     * Limit how many Enclosures to delete.
     */
    limit?: number
  }

  /**
   * Enclosure findRaw
   */
  export type EnclosureFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Enclosure aggregateRaw
   */
  export type EnclosureAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Enclosure.rows
   */
  export type Enclosure$rowsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Row
     */
    select?: RowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Row
     */
    omit?: RowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RowInclude<ExtArgs> | null
    where?: RowWhereInput
    orderBy?: RowOrderByWithRelationInput | RowOrderByWithRelationInput[]
    cursor?: RowWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RowScalarFieldEnum | RowScalarFieldEnum[]
  }

  /**
   * Enclosure without action
   */
  export type EnclosureDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enclosure
     */
    select?: EnclosureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Enclosure
     */
    omit?: EnclosureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnclosureInclude<ExtArgs> | null
  }


  /**
   * Model Row
   */

  export type AggregateRow = {
    _count: RowCountAggregateOutputType | null
    _avg: RowAvgAggregateOutputType | null
    _sum: RowSumAggregateOutputType | null
    _min: RowMinAggregateOutputType | null
    _max: RowMaxAggregateOutputType | null
  }

  export type RowAvgAggregateOutputType = {
    startSeat: number | null
    endSeat: number | null
  }

  export type RowSumAggregateOutputType = {
    startSeat: number | null
    endSeat: number | null
  }

  export type RowMinAggregateOutputType = {
    id: string | null
    letter: string | null
    startSeat: number | null
    endSeat: number | null
    reserved: string | null
    enclosureId: string | null
  }

  export type RowMaxAggregateOutputType = {
    id: string | null
    letter: string | null
    startSeat: number | null
    endSeat: number | null
    reserved: string | null
    enclosureId: string | null
  }

  export type RowCountAggregateOutputType = {
    id: number
    letter: number
    startSeat: number
    endSeat: number
    reserved: number
    enclosureId: number
    _all: number
  }


  export type RowAvgAggregateInputType = {
    startSeat?: true
    endSeat?: true
  }

  export type RowSumAggregateInputType = {
    startSeat?: true
    endSeat?: true
  }

  export type RowMinAggregateInputType = {
    id?: true
    letter?: true
    startSeat?: true
    endSeat?: true
    reserved?: true
    enclosureId?: true
  }

  export type RowMaxAggregateInputType = {
    id?: true
    letter?: true
    startSeat?: true
    endSeat?: true
    reserved?: true
    enclosureId?: true
  }

  export type RowCountAggregateInputType = {
    id?: true
    letter?: true
    startSeat?: true
    endSeat?: true
    reserved?: true
    enclosureId?: true
    _all?: true
  }

  export type RowAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Row to aggregate.
     */
    where?: RowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rows to fetch.
     */
    orderBy?: RowOrderByWithRelationInput | RowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Rows
    **/
    _count?: true | RowCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RowAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RowSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RowMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RowMaxAggregateInputType
  }

  export type GetRowAggregateType<T extends RowAggregateArgs> = {
        [P in keyof T & keyof AggregateRow]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRow[P]>
      : GetScalarType<T[P], AggregateRow[P]>
  }




  export type RowGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RowWhereInput
    orderBy?: RowOrderByWithAggregationInput | RowOrderByWithAggregationInput[]
    by: RowScalarFieldEnum[] | RowScalarFieldEnum
    having?: RowScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RowCountAggregateInputType | true
    _avg?: RowAvgAggregateInputType
    _sum?: RowSumAggregateInputType
    _min?: RowMinAggregateInputType
    _max?: RowMaxAggregateInputType
  }

  export type RowGroupByOutputType = {
    id: string
    letter: string
    startSeat: number
    endSeat: number
    reserved: string
    enclosureId: string
    _count: RowCountAggregateOutputType | null
    _avg: RowAvgAggregateOutputType | null
    _sum: RowSumAggregateOutputType | null
    _min: RowMinAggregateOutputType | null
    _max: RowMaxAggregateOutputType | null
  }

  type GetRowGroupByPayload<T extends RowGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RowGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RowGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RowGroupByOutputType[P]>
            : GetScalarType<T[P], RowGroupByOutputType[P]>
        }
      >
    >


  export type RowSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    letter?: boolean
    startSeat?: boolean
    endSeat?: boolean
    reserved?: boolean
    enclosureId?: boolean
    enclosure?: boolean | EnclosureDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["row"]>



  export type RowSelectScalar = {
    id?: boolean
    letter?: boolean
    startSeat?: boolean
    endSeat?: boolean
    reserved?: boolean
    enclosureId?: boolean
  }

  export type RowOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "letter" | "startSeat" | "endSeat" | "reserved" | "enclosureId", ExtArgs["result"]["row"]>
  export type RowInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    enclosure?: boolean | EnclosureDefaultArgs<ExtArgs>
  }

  export type $RowPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Row"
    objects: {
      enclosure: Prisma.$EnclosurePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      letter: string
      startSeat: number
      endSeat: number
      reserved: string
      enclosureId: string
    }, ExtArgs["result"]["row"]>
    composites: {}
  }

  type RowGetPayload<S extends boolean | null | undefined | RowDefaultArgs> = $Result.GetResult<Prisma.$RowPayload, S>

  type RowCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RowFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RowCountAggregateInputType | true
    }

  export interface RowDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Row'], meta: { name: 'Row' } }
    /**
     * Find zero or one Row that matches the filter.
     * @param {RowFindUniqueArgs} args - Arguments to find a Row
     * @example
     * // Get one Row
     * const row = await prisma.row.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RowFindUniqueArgs>(args: SelectSubset<T, RowFindUniqueArgs<ExtArgs>>): Prisma__RowClient<$Result.GetResult<Prisma.$RowPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Row that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RowFindUniqueOrThrowArgs} args - Arguments to find a Row
     * @example
     * // Get one Row
     * const row = await prisma.row.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RowFindUniqueOrThrowArgs>(args: SelectSubset<T, RowFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RowClient<$Result.GetResult<Prisma.$RowPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Row that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RowFindFirstArgs} args - Arguments to find a Row
     * @example
     * // Get one Row
     * const row = await prisma.row.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RowFindFirstArgs>(args?: SelectSubset<T, RowFindFirstArgs<ExtArgs>>): Prisma__RowClient<$Result.GetResult<Prisma.$RowPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Row that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RowFindFirstOrThrowArgs} args - Arguments to find a Row
     * @example
     * // Get one Row
     * const row = await prisma.row.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RowFindFirstOrThrowArgs>(args?: SelectSubset<T, RowFindFirstOrThrowArgs<ExtArgs>>): Prisma__RowClient<$Result.GetResult<Prisma.$RowPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Rows that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RowFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Rows
     * const rows = await prisma.row.findMany()
     * 
     * // Get first 10 Rows
     * const rows = await prisma.row.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rowWithIdOnly = await prisma.row.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RowFindManyArgs>(args?: SelectSubset<T, RowFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RowPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Row.
     * @param {RowCreateArgs} args - Arguments to create a Row.
     * @example
     * // Create one Row
     * const Row = await prisma.row.create({
     *   data: {
     *     // ... data to create a Row
     *   }
     * })
     * 
     */
    create<T extends RowCreateArgs>(args: SelectSubset<T, RowCreateArgs<ExtArgs>>): Prisma__RowClient<$Result.GetResult<Prisma.$RowPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Rows.
     * @param {RowCreateManyArgs} args - Arguments to create many Rows.
     * @example
     * // Create many Rows
     * const row = await prisma.row.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RowCreateManyArgs>(args?: SelectSubset<T, RowCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Row.
     * @param {RowDeleteArgs} args - Arguments to delete one Row.
     * @example
     * // Delete one Row
     * const Row = await prisma.row.delete({
     *   where: {
     *     // ... filter to delete one Row
     *   }
     * })
     * 
     */
    delete<T extends RowDeleteArgs>(args: SelectSubset<T, RowDeleteArgs<ExtArgs>>): Prisma__RowClient<$Result.GetResult<Prisma.$RowPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Row.
     * @param {RowUpdateArgs} args - Arguments to update one Row.
     * @example
     * // Update one Row
     * const row = await prisma.row.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RowUpdateArgs>(args: SelectSubset<T, RowUpdateArgs<ExtArgs>>): Prisma__RowClient<$Result.GetResult<Prisma.$RowPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Rows.
     * @param {RowDeleteManyArgs} args - Arguments to filter Rows to delete.
     * @example
     * // Delete a few Rows
     * const { count } = await prisma.row.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RowDeleteManyArgs>(args?: SelectSubset<T, RowDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Rows.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RowUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Rows
     * const row = await prisma.row.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RowUpdateManyArgs>(args: SelectSubset<T, RowUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Row.
     * @param {RowUpsertArgs} args - Arguments to update or create a Row.
     * @example
     * // Update or create a Row
     * const row = await prisma.row.upsert({
     *   create: {
     *     // ... data to create a Row
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Row we want to update
     *   }
     * })
     */
    upsert<T extends RowUpsertArgs>(args: SelectSubset<T, RowUpsertArgs<ExtArgs>>): Prisma__RowClient<$Result.GetResult<Prisma.$RowPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Rows that matches the filter.
     * @param {RowFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const row = await prisma.row.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: RowFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Row.
     * @param {RowAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const row = await prisma.row.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: RowAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Rows.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RowCountArgs} args - Arguments to filter Rows to count.
     * @example
     * // Count the number of Rows
     * const count = await prisma.row.count({
     *   where: {
     *     // ... the filter for the Rows we want to count
     *   }
     * })
    **/
    count<T extends RowCountArgs>(
      args?: Subset<T, RowCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RowCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Row.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RowAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RowAggregateArgs>(args: Subset<T, RowAggregateArgs>): Prisma.PrismaPromise<GetRowAggregateType<T>>

    /**
     * Group by Row.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RowGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RowGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RowGroupByArgs['orderBy'] }
        : { orderBy?: RowGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RowGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRowGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Row model
   */
  readonly fields: RowFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Row.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RowClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    enclosure<T extends EnclosureDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EnclosureDefaultArgs<ExtArgs>>): Prisma__EnclosureClient<$Result.GetResult<Prisma.$EnclosurePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Row model
   */
  interface RowFieldRefs {
    readonly id: FieldRef<"Row", 'String'>
    readonly letter: FieldRef<"Row", 'String'>
    readonly startSeat: FieldRef<"Row", 'Int'>
    readonly endSeat: FieldRef<"Row", 'Int'>
    readonly reserved: FieldRef<"Row", 'String'>
    readonly enclosureId: FieldRef<"Row", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Row findUnique
   */
  export type RowFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Row
     */
    select?: RowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Row
     */
    omit?: RowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RowInclude<ExtArgs> | null
    /**
     * Filter, which Row to fetch.
     */
    where: RowWhereUniqueInput
  }

  /**
   * Row findUniqueOrThrow
   */
  export type RowFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Row
     */
    select?: RowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Row
     */
    omit?: RowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RowInclude<ExtArgs> | null
    /**
     * Filter, which Row to fetch.
     */
    where: RowWhereUniqueInput
  }

  /**
   * Row findFirst
   */
  export type RowFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Row
     */
    select?: RowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Row
     */
    omit?: RowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RowInclude<ExtArgs> | null
    /**
     * Filter, which Row to fetch.
     */
    where?: RowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rows to fetch.
     */
    orderBy?: RowOrderByWithRelationInput | RowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rows.
     */
    cursor?: RowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rows.
     */
    distinct?: RowScalarFieldEnum | RowScalarFieldEnum[]
  }

  /**
   * Row findFirstOrThrow
   */
  export type RowFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Row
     */
    select?: RowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Row
     */
    omit?: RowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RowInclude<ExtArgs> | null
    /**
     * Filter, which Row to fetch.
     */
    where?: RowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rows to fetch.
     */
    orderBy?: RowOrderByWithRelationInput | RowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rows.
     */
    cursor?: RowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rows.
     */
    distinct?: RowScalarFieldEnum | RowScalarFieldEnum[]
  }

  /**
   * Row findMany
   */
  export type RowFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Row
     */
    select?: RowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Row
     */
    omit?: RowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RowInclude<ExtArgs> | null
    /**
     * Filter, which Rows to fetch.
     */
    where?: RowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rows to fetch.
     */
    orderBy?: RowOrderByWithRelationInput | RowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Rows.
     */
    cursor?: RowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rows.
     */
    skip?: number
    distinct?: RowScalarFieldEnum | RowScalarFieldEnum[]
  }

  /**
   * Row create
   */
  export type RowCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Row
     */
    select?: RowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Row
     */
    omit?: RowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RowInclude<ExtArgs> | null
    /**
     * The data needed to create a Row.
     */
    data: XOR<RowCreateInput, RowUncheckedCreateInput>
  }

  /**
   * Row createMany
   */
  export type RowCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Rows.
     */
    data: RowCreateManyInput | RowCreateManyInput[]
  }

  /**
   * Row update
   */
  export type RowUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Row
     */
    select?: RowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Row
     */
    omit?: RowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RowInclude<ExtArgs> | null
    /**
     * The data needed to update a Row.
     */
    data: XOR<RowUpdateInput, RowUncheckedUpdateInput>
    /**
     * Choose, which Row to update.
     */
    where: RowWhereUniqueInput
  }

  /**
   * Row updateMany
   */
  export type RowUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Rows.
     */
    data: XOR<RowUpdateManyMutationInput, RowUncheckedUpdateManyInput>
    /**
     * Filter which Rows to update
     */
    where?: RowWhereInput
    /**
     * Limit how many Rows to update.
     */
    limit?: number
  }

  /**
   * Row upsert
   */
  export type RowUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Row
     */
    select?: RowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Row
     */
    omit?: RowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RowInclude<ExtArgs> | null
    /**
     * The filter to search for the Row to update in case it exists.
     */
    where: RowWhereUniqueInput
    /**
     * In case the Row found by the `where` argument doesn't exist, create a new Row with this data.
     */
    create: XOR<RowCreateInput, RowUncheckedCreateInput>
    /**
     * In case the Row was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RowUpdateInput, RowUncheckedUpdateInput>
  }

  /**
   * Row delete
   */
  export type RowDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Row
     */
    select?: RowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Row
     */
    omit?: RowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RowInclude<ExtArgs> | null
    /**
     * Filter which Row to delete.
     */
    where: RowWhereUniqueInput
  }

  /**
   * Row deleteMany
   */
  export type RowDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rows to delete
     */
    where?: RowWhereInput
    /**
     * Limit how many Rows to delete.
     */
    limit?: number
  }

  /**
   * Row findRaw
   */
  export type RowFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Row aggregateRaw
   */
  export type RowAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Row without action
   */
  export type RowDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Row
     */
    select?: RowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Row
     */
    omit?: RowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RowInclude<ExtArgs> | null
  }


  /**
   * Model Analytics
   */

  export type AggregateAnalytics = {
    _count: AnalyticsCountAggregateOutputType | null
    _avg: AnalyticsAvgAggregateOutputType | null
    _sum: AnalyticsSumAggregateOutputType | null
    _min: AnalyticsMinAggregateOutputType | null
    _max: AnalyticsMaxAggregateOutputType | null
  }

  export type AnalyticsAvgAggregateOutputType = {
    visitors: number | null
    pageViews: number | null
    uniqueVisitors: number | null
  }

  export type AnalyticsSumAggregateOutputType = {
    visitors: number | null
    pageViews: number | null
    uniqueVisitors: number | null
  }

  export type AnalyticsMinAggregateOutputType = {
    id: string | null
    date: Date | null
    visitors: number | null
    pageViews: number | null
    uniqueVisitors: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AnalyticsMaxAggregateOutputType = {
    id: string | null
    date: Date | null
    visitors: number | null
    pageViews: number | null
    uniqueVisitors: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AnalyticsCountAggregateOutputType = {
    id: number
    date: number
    visitors: number
    pageViews: number
    uniqueVisitors: number
    countries: number
    languages: number
    devices: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AnalyticsAvgAggregateInputType = {
    visitors?: true
    pageViews?: true
    uniqueVisitors?: true
  }

  export type AnalyticsSumAggregateInputType = {
    visitors?: true
    pageViews?: true
    uniqueVisitors?: true
  }

  export type AnalyticsMinAggregateInputType = {
    id?: true
    date?: true
    visitors?: true
    pageViews?: true
    uniqueVisitors?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AnalyticsMaxAggregateInputType = {
    id?: true
    date?: true
    visitors?: true
    pageViews?: true
    uniqueVisitors?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AnalyticsCountAggregateInputType = {
    id?: true
    date?: true
    visitors?: true
    pageViews?: true
    uniqueVisitors?: true
    countries?: true
    languages?: true
    devices?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AnalyticsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Analytics to aggregate.
     */
    where?: AnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Analytics to fetch.
     */
    orderBy?: AnalyticsOrderByWithRelationInput | AnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Analytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Analytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Analytics
    **/
    _count?: true | AnalyticsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AnalyticsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AnalyticsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnalyticsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnalyticsMaxAggregateInputType
  }

  export type GetAnalyticsAggregateType<T extends AnalyticsAggregateArgs> = {
        [P in keyof T & keyof AggregateAnalytics]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnalytics[P]>
      : GetScalarType<T[P], AggregateAnalytics[P]>
  }




  export type AnalyticsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalyticsWhereInput
    orderBy?: AnalyticsOrderByWithAggregationInput | AnalyticsOrderByWithAggregationInput[]
    by: AnalyticsScalarFieldEnum[] | AnalyticsScalarFieldEnum
    having?: AnalyticsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnalyticsCountAggregateInputType | true
    _avg?: AnalyticsAvgAggregateInputType
    _sum?: AnalyticsSumAggregateInputType
    _min?: AnalyticsMinAggregateInputType
    _max?: AnalyticsMaxAggregateInputType
  }

  export type AnalyticsGroupByOutputType = {
    id: string
    date: Date
    visitors: number
    pageViews: number
    uniqueVisitors: number
    countries: JsonValue
    languages: JsonValue
    devices: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: AnalyticsCountAggregateOutputType | null
    _avg: AnalyticsAvgAggregateOutputType | null
    _sum: AnalyticsSumAggregateOutputType | null
    _min: AnalyticsMinAggregateOutputType | null
    _max: AnalyticsMaxAggregateOutputType | null
  }

  type GetAnalyticsGroupByPayload<T extends AnalyticsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnalyticsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnalyticsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnalyticsGroupByOutputType[P]>
            : GetScalarType<T[P], AnalyticsGroupByOutputType[P]>
        }
      >
    >


  export type AnalyticsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    visitors?: boolean
    pageViews?: boolean
    uniqueVisitors?: boolean
    countries?: boolean
    languages?: boolean
    devices?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["analytics"]>



  export type AnalyticsSelectScalar = {
    id?: boolean
    date?: boolean
    visitors?: boolean
    pageViews?: boolean
    uniqueVisitors?: boolean
    countries?: boolean
    languages?: boolean
    devices?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AnalyticsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "date" | "visitors" | "pageViews" | "uniqueVisitors" | "countries" | "languages" | "devices" | "createdAt" | "updatedAt", ExtArgs["result"]["analytics"]>

  export type $AnalyticsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Analytics"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      date: Date
      visitors: number
      pageViews: number
      uniqueVisitors: number
      countries: Prisma.JsonValue
      languages: Prisma.JsonValue
      devices: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["analytics"]>
    composites: {}
  }

  type AnalyticsGetPayload<S extends boolean | null | undefined | AnalyticsDefaultArgs> = $Result.GetResult<Prisma.$AnalyticsPayload, S>

  type AnalyticsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AnalyticsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AnalyticsCountAggregateInputType | true
    }

  export interface AnalyticsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Analytics'], meta: { name: 'Analytics' } }
    /**
     * Find zero or one Analytics that matches the filter.
     * @param {AnalyticsFindUniqueArgs} args - Arguments to find a Analytics
     * @example
     * // Get one Analytics
     * const analytics = await prisma.analytics.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnalyticsFindUniqueArgs>(args: SelectSubset<T, AnalyticsFindUniqueArgs<ExtArgs>>): Prisma__AnalyticsClient<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Analytics that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AnalyticsFindUniqueOrThrowArgs} args - Arguments to find a Analytics
     * @example
     * // Get one Analytics
     * const analytics = await prisma.analytics.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnalyticsFindUniqueOrThrowArgs>(args: SelectSubset<T, AnalyticsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnalyticsClient<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Analytics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsFindFirstArgs} args - Arguments to find a Analytics
     * @example
     * // Get one Analytics
     * const analytics = await prisma.analytics.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnalyticsFindFirstArgs>(args?: SelectSubset<T, AnalyticsFindFirstArgs<ExtArgs>>): Prisma__AnalyticsClient<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Analytics that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsFindFirstOrThrowArgs} args - Arguments to find a Analytics
     * @example
     * // Get one Analytics
     * const analytics = await prisma.analytics.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnalyticsFindFirstOrThrowArgs>(args?: SelectSubset<T, AnalyticsFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnalyticsClient<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Analytics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Analytics
     * const analytics = await prisma.analytics.findMany()
     * 
     * // Get first 10 Analytics
     * const analytics = await prisma.analytics.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const analyticsWithIdOnly = await prisma.analytics.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnalyticsFindManyArgs>(args?: SelectSubset<T, AnalyticsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Analytics.
     * @param {AnalyticsCreateArgs} args - Arguments to create a Analytics.
     * @example
     * // Create one Analytics
     * const Analytics = await prisma.analytics.create({
     *   data: {
     *     // ... data to create a Analytics
     *   }
     * })
     * 
     */
    create<T extends AnalyticsCreateArgs>(args: SelectSubset<T, AnalyticsCreateArgs<ExtArgs>>): Prisma__AnalyticsClient<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Analytics.
     * @param {AnalyticsCreateManyArgs} args - Arguments to create many Analytics.
     * @example
     * // Create many Analytics
     * const analytics = await prisma.analytics.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnalyticsCreateManyArgs>(args?: SelectSubset<T, AnalyticsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Analytics.
     * @param {AnalyticsDeleteArgs} args - Arguments to delete one Analytics.
     * @example
     * // Delete one Analytics
     * const Analytics = await prisma.analytics.delete({
     *   where: {
     *     // ... filter to delete one Analytics
     *   }
     * })
     * 
     */
    delete<T extends AnalyticsDeleteArgs>(args: SelectSubset<T, AnalyticsDeleteArgs<ExtArgs>>): Prisma__AnalyticsClient<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Analytics.
     * @param {AnalyticsUpdateArgs} args - Arguments to update one Analytics.
     * @example
     * // Update one Analytics
     * const analytics = await prisma.analytics.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnalyticsUpdateArgs>(args: SelectSubset<T, AnalyticsUpdateArgs<ExtArgs>>): Prisma__AnalyticsClient<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Analytics.
     * @param {AnalyticsDeleteManyArgs} args - Arguments to filter Analytics to delete.
     * @example
     * // Delete a few Analytics
     * const { count } = await prisma.analytics.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnalyticsDeleteManyArgs>(args?: SelectSubset<T, AnalyticsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Analytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Analytics
     * const analytics = await prisma.analytics.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnalyticsUpdateManyArgs>(args: SelectSubset<T, AnalyticsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Analytics.
     * @param {AnalyticsUpsertArgs} args - Arguments to update or create a Analytics.
     * @example
     * // Update or create a Analytics
     * const analytics = await prisma.analytics.upsert({
     *   create: {
     *     // ... data to create a Analytics
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Analytics we want to update
     *   }
     * })
     */
    upsert<T extends AnalyticsUpsertArgs>(args: SelectSubset<T, AnalyticsUpsertArgs<ExtArgs>>): Prisma__AnalyticsClient<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Analytics that matches the filter.
     * @param {AnalyticsFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const analytics = await prisma.analytics.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: AnalyticsFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Analytics.
     * @param {AnalyticsAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const analytics = await prisma.analytics.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: AnalyticsAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Analytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsCountArgs} args - Arguments to filter Analytics to count.
     * @example
     * // Count the number of Analytics
     * const count = await prisma.analytics.count({
     *   where: {
     *     // ... the filter for the Analytics we want to count
     *   }
     * })
    **/
    count<T extends AnalyticsCountArgs>(
      args?: Subset<T, AnalyticsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnalyticsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Analytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnalyticsAggregateArgs>(args: Subset<T, AnalyticsAggregateArgs>): Prisma.PrismaPromise<GetAnalyticsAggregateType<T>>

    /**
     * Group by Analytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnalyticsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnalyticsGroupByArgs['orderBy'] }
        : { orderBy?: AnalyticsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnalyticsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnalyticsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Analytics model
   */
  readonly fields: AnalyticsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Analytics.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnalyticsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Analytics model
   */
  interface AnalyticsFieldRefs {
    readonly id: FieldRef<"Analytics", 'String'>
    readonly date: FieldRef<"Analytics", 'DateTime'>
    readonly visitors: FieldRef<"Analytics", 'Int'>
    readonly pageViews: FieldRef<"Analytics", 'Int'>
    readonly uniqueVisitors: FieldRef<"Analytics", 'Int'>
    readonly countries: FieldRef<"Analytics", 'Json'>
    readonly languages: FieldRef<"Analytics", 'Json'>
    readonly devices: FieldRef<"Analytics", 'Json'>
    readonly createdAt: FieldRef<"Analytics", 'DateTime'>
    readonly updatedAt: FieldRef<"Analytics", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Analytics findUnique
   */
  export type AnalyticsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which Analytics to fetch.
     */
    where: AnalyticsWhereUniqueInput
  }

  /**
   * Analytics findUniqueOrThrow
   */
  export type AnalyticsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which Analytics to fetch.
     */
    where: AnalyticsWhereUniqueInput
  }

  /**
   * Analytics findFirst
   */
  export type AnalyticsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which Analytics to fetch.
     */
    where?: AnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Analytics to fetch.
     */
    orderBy?: AnalyticsOrderByWithRelationInput | AnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Analytics.
     */
    cursor?: AnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Analytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Analytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Analytics.
     */
    distinct?: AnalyticsScalarFieldEnum | AnalyticsScalarFieldEnum[]
  }

  /**
   * Analytics findFirstOrThrow
   */
  export type AnalyticsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which Analytics to fetch.
     */
    where?: AnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Analytics to fetch.
     */
    orderBy?: AnalyticsOrderByWithRelationInput | AnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Analytics.
     */
    cursor?: AnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Analytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Analytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Analytics.
     */
    distinct?: AnalyticsScalarFieldEnum | AnalyticsScalarFieldEnum[]
  }

  /**
   * Analytics findMany
   */
  export type AnalyticsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which Analytics to fetch.
     */
    where?: AnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Analytics to fetch.
     */
    orderBy?: AnalyticsOrderByWithRelationInput | AnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Analytics.
     */
    cursor?: AnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Analytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Analytics.
     */
    skip?: number
    distinct?: AnalyticsScalarFieldEnum | AnalyticsScalarFieldEnum[]
  }

  /**
   * Analytics create
   */
  export type AnalyticsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * The data needed to create a Analytics.
     */
    data: XOR<AnalyticsCreateInput, AnalyticsUncheckedCreateInput>
  }

  /**
   * Analytics createMany
   */
  export type AnalyticsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Analytics.
     */
    data: AnalyticsCreateManyInput | AnalyticsCreateManyInput[]
  }

  /**
   * Analytics update
   */
  export type AnalyticsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * The data needed to update a Analytics.
     */
    data: XOR<AnalyticsUpdateInput, AnalyticsUncheckedUpdateInput>
    /**
     * Choose, which Analytics to update.
     */
    where: AnalyticsWhereUniqueInput
  }

  /**
   * Analytics updateMany
   */
  export type AnalyticsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Analytics.
     */
    data: XOR<AnalyticsUpdateManyMutationInput, AnalyticsUncheckedUpdateManyInput>
    /**
     * Filter which Analytics to update
     */
    where?: AnalyticsWhereInput
    /**
     * Limit how many Analytics to update.
     */
    limit?: number
  }

  /**
   * Analytics upsert
   */
  export type AnalyticsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * The filter to search for the Analytics to update in case it exists.
     */
    where: AnalyticsWhereUniqueInput
    /**
     * In case the Analytics found by the `where` argument doesn't exist, create a new Analytics with this data.
     */
    create: XOR<AnalyticsCreateInput, AnalyticsUncheckedCreateInput>
    /**
     * In case the Analytics was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnalyticsUpdateInput, AnalyticsUncheckedUpdateInput>
  }

  /**
   * Analytics delete
   */
  export type AnalyticsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * Filter which Analytics to delete.
     */
    where: AnalyticsWhereUniqueInput
  }

  /**
   * Analytics deleteMany
   */
  export type AnalyticsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Analytics to delete
     */
    where?: AnalyticsWhereInput
    /**
     * Limit how many Analytics to delete.
     */
    limit?: number
  }

  /**
   * Analytics findRaw
   */
  export type AnalyticsFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Analytics aggregateRaw
   */
  export type AnalyticsAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Analytics without action
   */
  export type AnalyticsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
  }


  /**
   * Model IAMPolicy
   */

  export type AggregateIAMPolicy = {
    _count: IAMPolicyCountAggregateOutputType | null
    _min: IAMPolicyMinAggregateOutputType | null
    _max: IAMPolicyMaxAggregateOutputType | null
  }

  export type IAMPolicyMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type IAMPolicyMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type IAMPolicyCountAggregateOutputType = {
    id: number
    name: number
    description: number
    permissions: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type IAMPolicyMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type IAMPolicyMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type IAMPolicyCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    permissions?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type IAMPolicyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IAMPolicy to aggregate.
     */
    where?: IAMPolicyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IAMPolicies to fetch.
     */
    orderBy?: IAMPolicyOrderByWithRelationInput | IAMPolicyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IAMPolicyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IAMPolicies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IAMPolicies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned IAMPolicies
    **/
    _count?: true | IAMPolicyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IAMPolicyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IAMPolicyMaxAggregateInputType
  }

  export type GetIAMPolicyAggregateType<T extends IAMPolicyAggregateArgs> = {
        [P in keyof T & keyof AggregateIAMPolicy]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIAMPolicy[P]>
      : GetScalarType<T[P], AggregateIAMPolicy[P]>
  }




  export type IAMPolicyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IAMPolicyWhereInput
    orderBy?: IAMPolicyOrderByWithAggregationInput | IAMPolicyOrderByWithAggregationInput[]
    by: IAMPolicyScalarFieldEnum[] | IAMPolicyScalarFieldEnum
    having?: IAMPolicyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IAMPolicyCountAggregateInputType | true
    _min?: IAMPolicyMinAggregateInputType
    _max?: IAMPolicyMaxAggregateInputType
  }

  export type IAMPolicyGroupByOutputType = {
    id: string
    name: string
    description: string
    permissions: string[]
    createdAt: Date
    updatedAt: Date
    _count: IAMPolicyCountAggregateOutputType | null
    _min: IAMPolicyMinAggregateOutputType | null
    _max: IAMPolicyMaxAggregateOutputType | null
  }

  type GetIAMPolicyGroupByPayload<T extends IAMPolicyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IAMPolicyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IAMPolicyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IAMPolicyGroupByOutputType[P]>
            : GetScalarType<T[P], IAMPolicyGroupByOutputType[P]>
        }
      >
    >


  export type IAMPolicySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    permissions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["iAMPolicy"]>



  export type IAMPolicySelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    permissions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type IAMPolicyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "permissions" | "createdAt" | "updatedAt", ExtArgs["result"]["iAMPolicy"]>

  export type $IAMPolicyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "IAMPolicy"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string
      permissions: string[]
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["iAMPolicy"]>
    composites: {}
  }

  type IAMPolicyGetPayload<S extends boolean | null | undefined | IAMPolicyDefaultArgs> = $Result.GetResult<Prisma.$IAMPolicyPayload, S>

  type IAMPolicyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<IAMPolicyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: IAMPolicyCountAggregateInputType | true
    }

  export interface IAMPolicyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['IAMPolicy'], meta: { name: 'IAMPolicy' } }
    /**
     * Find zero or one IAMPolicy that matches the filter.
     * @param {IAMPolicyFindUniqueArgs} args - Arguments to find a IAMPolicy
     * @example
     * // Get one IAMPolicy
     * const iAMPolicy = await prisma.iAMPolicy.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IAMPolicyFindUniqueArgs>(args: SelectSubset<T, IAMPolicyFindUniqueArgs<ExtArgs>>): Prisma__IAMPolicyClient<$Result.GetResult<Prisma.$IAMPolicyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one IAMPolicy that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {IAMPolicyFindUniqueOrThrowArgs} args - Arguments to find a IAMPolicy
     * @example
     * // Get one IAMPolicy
     * const iAMPolicy = await prisma.iAMPolicy.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IAMPolicyFindUniqueOrThrowArgs>(args: SelectSubset<T, IAMPolicyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IAMPolicyClient<$Result.GetResult<Prisma.$IAMPolicyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IAMPolicy that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IAMPolicyFindFirstArgs} args - Arguments to find a IAMPolicy
     * @example
     * // Get one IAMPolicy
     * const iAMPolicy = await prisma.iAMPolicy.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IAMPolicyFindFirstArgs>(args?: SelectSubset<T, IAMPolicyFindFirstArgs<ExtArgs>>): Prisma__IAMPolicyClient<$Result.GetResult<Prisma.$IAMPolicyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IAMPolicy that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IAMPolicyFindFirstOrThrowArgs} args - Arguments to find a IAMPolicy
     * @example
     * // Get one IAMPolicy
     * const iAMPolicy = await prisma.iAMPolicy.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IAMPolicyFindFirstOrThrowArgs>(args?: SelectSubset<T, IAMPolicyFindFirstOrThrowArgs<ExtArgs>>): Prisma__IAMPolicyClient<$Result.GetResult<Prisma.$IAMPolicyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more IAMPolicies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IAMPolicyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IAMPolicies
     * const iAMPolicies = await prisma.iAMPolicy.findMany()
     * 
     * // Get first 10 IAMPolicies
     * const iAMPolicies = await prisma.iAMPolicy.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const iAMPolicyWithIdOnly = await prisma.iAMPolicy.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends IAMPolicyFindManyArgs>(args?: SelectSubset<T, IAMPolicyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IAMPolicyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a IAMPolicy.
     * @param {IAMPolicyCreateArgs} args - Arguments to create a IAMPolicy.
     * @example
     * // Create one IAMPolicy
     * const IAMPolicy = await prisma.iAMPolicy.create({
     *   data: {
     *     // ... data to create a IAMPolicy
     *   }
     * })
     * 
     */
    create<T extends IAMPolicyCreateArgs>(args: SelectSubset<T, IAMPolicyCreateArgs<ExtArgs>>): Prisma__IAMPolicyClient<$Result.GetResult<Prisma.$IAMPolicyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many IAMPolicies.
     * @param {IAMPolicyCreateManyArgs} args - Arguments to create many IAMPolicies.
     * @example
     * // Create many IAMPolicies
     * const iAMPolicy = await prisma.iAMPolicy.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IAMPolicyCreateManyArgs>(args?: SelectSubset<T, IAMPolicyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a IAMPolicy.
     * @param {IAMPolicyDeleteArgs} args - Arguments to delete one IAMPolicy.
     * @example
     * // Delete one IAMPolicy
     * const IAMPolicy = await prisma.iAMPolicy.delete({
     *   where: {
     *     // ... filter to delete one IAMPolicy
     *   }
     * })
     * 
     */
    delete<T extends IAMPolicyDeleteArgs>(args: SelectSubset<T, IAMPolicyDeleteArgs<ExtArgs>>): Prisma__IAMPolicyClient<$Result.GetResult<Prisma.$IAMPolicyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one IAMPolicy.
     * @param {IAMPolicyUpdateArgs} args - Arguments to update one IAMPolicy.
     * @example
     * // Update one IAMPolicy
     * const iAMPolicy = await prisma.iAMPolicy.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IAMPolicyUpdateArgs>(args: SelectSubset<T, IAMPolicyUpdateArgs<ExtArgs>>): Prisma__IAMPolicyClient<$Result.GetResult<Prisma.$IAMPolicyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more IAMPolicies.
     * @param {IAMPolicyDeleteManyArgs} args - Arguments to filter IAMPolicies to delete.
     * @example
     * // Delete a few IAMPolicies
     * const { count } = await prisma.iAMPolicy.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IAMPolicyDeleteManyArgs>(args?: SelectSubset<T, IAMPolicyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IAMPolicies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IAMPolicyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IAMPolicies
     * const iAMPolicy = await prisma.iAMPolicy.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IAMPolicyUpdateManyArgs>(args: SelectSubset<T, IAMPolicyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one IAMPolicy.
     * @param {IAMPolicyUpsertArgs} args - Arguments to update or create a IAMPolicy.
     * @example
     * // Update or create a IAMPolicy
     * const iAMPolicy = await prisma.iAMPolicy.upsert({
     *   create: {
     *     // ... data to create a IAMPolicy
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IAMPolicy we want to update
     *   }
     * })
     */
    upsert<T extends IAMPolicyUpsertArgs>(args: SelectSubset<T, IAMPolicyUpsertArgs<ExtArgs>>): Prisma__IAMPolicyClient<$Result.GetResult<Prisma.$IAMPolicyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more IAMPolicies that matches the filter.
     * @param {IAMPolicyFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const iAMPolicy = await prisma.iAMPolicy.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: IAMPolicyFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a IAMPolicy.
     * @param {IAMPolicyAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const iAMPolicy = await prisma.iAMPolicy.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: IAMPolicyAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of IAMPolicies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IAMPolicyCountArgs} args - Arguments to filter IAMPolicies to count.
     * @example
     * // Count the number of IAMPolicies
     * const count = await prisma.iAMPolicy.count({
     *   where: {
     *     // ... the filter for the IAMPolicies we want to count
     *   }
     * })
    **/
    count<T extends IAMPolicyCountArgs>(
      args?: Subset<T, IAMPolicyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IAMPolicyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a IAMPolicy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IAMPolicyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends IAMPolicyAggregateArgs>(args: Subset<T, IAMPolicyAggregateArgs>): Prisma.PrismaPromise<GetIAMPolicyAggregateType<T>>

    /**
     * Group by IAMPolicy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IAMPolicyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends IAMPolicyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IAMPolicyGroupByArgs['orderBy'] }
        : { orderBy?: IAMPolicyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, IAMPolicyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIAMPolicyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the IAMPolicy model
   */
  readonly fields: IAMPolicyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for IAMPolicy.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IAMPolicyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the IAMPolicy model
   */
  interface IAMPolicyFieldRefs {
    readonly id: FieldRef<"IAMPolicy", 'String'>
    readonly name: FieldRef<"IAMPolicy", 'String'>
    readonly description: FieldRef<"IAMPolicy", 'String'>
    readonly permissions: FieldRef<"IAMPolicy", 'String[]'>
    readonly createdAt: FieldRef<"IAMPolicy", 'DateTime'>
    readonly updatedAt: FieldRef<"IAMPolicy", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * IAMPolicy findUnique
   */
  export type IAMPolicyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IAMPolicy
     */
    select?: IAMPolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IAMPolicy
     */
    omit?: IAMPolicyOmit<ExtArgs> | null
    /**
     * Filter, which IAMPolicy to fetch.
     */
    where: IAMPolicyWhereUniqueInput
  }

  /**
   * IAMPolicy findUniqueOrThrow
   */
  export type IAMPolicyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IAMPolicy
     */
    select?: IAMPolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IAMPolicy
     */
    omit?: IAMPolicyOmit<ExtArgs> | null
    /**
     * Filter, which IAMPolicy to fetch.
     */
    where: IAMPolicyWhereUniqueInput
  }

  /**
   * IAMPolicy findFirst
   */
  export type IAMPolicyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IAMPolicy
     */
    select?: IAMPolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IAMPolicy
     */
    omit?: IAMPolicyOmit<ExtArgs> | null
    /**
     * Filter, which IAMPolicy to fetch.
     */
    where?: IAMPolicyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IAMPolicies to fetch.
     */
    orderBy?: IAMPolicyOrderByWithRelationInput | IAMPolicyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IAMPolicies.
     */
    cursor?: IAMPolicyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IAMPolicies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IAMPolicies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IAMPolicies.
     */
    distinct?: IAMPolicyScalarFieldEnum | IAMPolicyScalarFieldEnum[]
  }

  /**
   * IAMPolicy findFirstOrThrow
   */
  export type IAMPolicyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IAMPolicy
     */
    select?: IAMPolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IAMPolicy
     */
    omit?: IAMPolicyOmit<ExtArgs> | null
    /**
     * Filter, which IAMPolicy to fetch.
     */
    where?: IAMPolicyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IAMPolicies to fetch.
     */
    orderBy?: IAMPolicyOrderByWithRelationInput | IAMPolicyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IAMPolicies.
     */
    cursor?: IAMPolicyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IAMPolicies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IAMPolicies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IAMPolicies.
     */
    distinct?: IAMPolicyScalarFieldEnum | IAMPolicyScalarFieldEnum[]
  }

  /**
   * IAMPolicy findMany
   */
  export type IAMPolicyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IAMPolicy
     */
    select?: IAMPolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IAMPolicy
     */
    omit?: IAMPolicyOmit<ExtArgs> | null
    /**
     * Filter, which IAMPolicies to fetch.
     */
    where?: IAMPolicyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IAMPolicies to fetch.
     */
    orderBy?: IAMPolicyOrderByWithRelationInput | IAMPolicyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing IAMPolicies.
     */
    cursor?: IAMPolicyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IAMPolicies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IAMPolicies.
     */
    skip?: number
    distinct?: IAMPolicyScalarFieldEnum | IAMPolicyScalarFieldEnum[]
  }

  /**
   * IAMPolicy create
   */
  export type IAMPolicyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IAMPolicy
     */
    select?: IAMPolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IAMPolicy
     */
    omit?: IAMPolicyOmit<ExtArgs> | null
    /**
     * The data needed to create a IAMPolicy.
     */
    data: XOR<IAMPolicyCreateInput, IAMPolicyUncheckedCreateInput>
  }

  /**
   * IAMPolicy createMany
   */
  export type IAMPolicyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many IAMPolicies.
     */
    data: IAMPolicyCreateManyInput | IAMPolicyCreateManyInput[]
  }

  /**
   * IAMPolicy update
   */
  export type IAMPolicyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IAMPolicy
     */
    select?: IAMPolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IAMPolicy
     */
    omit?: IAMPolicyOmit<ExtArgs> | null
    /**
     * The data needed to update a IAMPolicy.
     */
    data: XOR<IAMPolicyUpdateInput, IAMPolicyUncheckedUpdateInput>
    /**
     * Choose, which IAMPolicy to update.
     */
    where: IAMPolicyWhereUniqueInput
  }

  /**
   * IAMPolicy updateMany
   */
  export type IAMPolicyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update IAMPolicies.
     */
    data: XOR<IAMPolicyUpdateManyMutationInput, IAMPolicyUncheckedUpdateManyInput>
    /**
     * Filter which IAMPolicies to update
     */
    where?: IAMPolicyWhereInput
    /**
     * Limit how many IAMPolicies to update.
     */
    limit?: number
  }

  /**
   * IAMPolicy upsert
   */
  export type IAMPolicyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IAMPolicy
     */
    select?: IAMPolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IAMPolicy
     */
    omit?: IAMPolicyOmit<ExtArgs> | null
    /**
     * The filter to search for the IAMPolicy to update in case it exists.
     */
    where: IAMPolicyWhereUniqueInput
    /**
     * In case the IAMPolicy found by the `where` argument doesn't exist, create a new IAMPolicy with this data.
     */
    create: XOR<IAMPolicyCreateInput, IAMPolicyUncheckedCreateInput>
    /**
     * In case the IAMPolicy was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IAMPolicyUpdateInput, IAMPolicyUncheckedUpdateInput>
  }

  /**
   * IAMPolicy delete
   */
  export type IAMPolicyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IAMPolicy
     */
    select?: IAMPolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IAMPolicy
     */
    omit?: IAMPolicyOmit<ExtArgs> | null
    /**
     * Filter which IAMPolicy to delete.
     */
    where: IAMPolicyWhereUniqueInput
  }

  /**
   * IAMPolicy deleteMany
   */
  export type IAMPolicyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IAMPolicies to delete
     */
    where?: IAMPolicyWhereInput
    /**
     * Limit how many IAMPolicies to delete.
     */
    limit?: number
  }

  /**
   * IAMPolicy findRaw
   */
  export type IAMPolicyFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * IAMPolicy aggregateRaw
   */
  export type IAMPolicyAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * IAMPolicy without action
   */
  export type IAMPolicyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IAMPolicy
     */
    select?: IAMPolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IAMPolicy
     */
    omit?: IAMPolicyOmit<ExtArgs> | null
  }


  /**
   * Model Department
   */

  export type AggregateDepartment = {
    _count: DepartmentCountAggregateOutputType | null
    _min: DepartmentMinAggregateOutputType | null
    _max: DepartmentMaxAggregateOutputType | null
  }

  export type DepartmentMinAggregateOutputType = {
    id: string | null
    name: string | null
    code: string | null
    school: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DepartmentMaxAggregateOutputType = {
    id: string | null
    name: string | null
    code: string | null
    school: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DepartmentCountAggregateOutputType = {
    id: number
    name: number
    code: number
    school: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DepartmentMinAggregateInputType = {
    id?: true
    name?: true
    code?: true
    school?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DepartmentMaxAggregateInputType = {
    id?: true
    name?: true
    code?: true
    school?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DepartmentCountAggregateInputType = {
    id?: true
    name?: true
    code?: true
    school?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DepartmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Department to aggregate.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Departments
    **/
    _count?: true | DepartmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DepartmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DepartmentMaxAggregateInputType
  }

  export type GetDepartmentAggregateType<T extends DepartmentAggregateArgs> = {
        [P in keyof T & keyof AggregateDepartment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDepartment[P]>
      : GetScalarType<T[P], AggregateDepartment[P]>
  }




  export type DepartmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepartmentWhereInput
    orderBy?: DepartmentOrderByWithAggregationInput | DepartmentOrderByWithAggregationInput[]
    by: DepartmentScalarFieldEnum[] | DepartmentScalarFieldEnum
    having?: DepartmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DepartmentCountAggregateInputType | true
    _min?: DepartmentMinAggregateInputType
    _max?: DepartmentMaxAggregateInputType
  }

  export type DepartmentGroupByOutputType = {
    id: string
    name: string
    code: string
    school: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: DepartmentCountAggregateOutputType | null
    _min: DepartmentMinAggregateOutputType | null
    _max: DepartmentMaxAggregateOutputType | null
  }

  type GetDepartmentGroupByPayload<T extends DepartmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DepartmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DepartmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DepartmentGroupByOutputType[P]>
            : GetScalarType<T[P], DepartmentGroupByOutputType[P]>
        }
      >
    >


  export type DepartmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    code?: boolean
    school?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["department"]>



  export type DepartmentSelectScalar = {
    id?: boolean
    name?: boolean
    code?: boolean
    school?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DepartmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "code" | "school" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["department"]>

  export type $DepartmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Department"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      code: string
      school: string
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["department"]>
    composites: {}
  }

  type DepartmentGetPayload<S extends boolean | null | undefined | DepartmentDefaultArgs> = $Result.GetResult<Prisma.$DepartmentPayload, S>

  type DepartmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DepartmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DepartmentCountAggregateInputType | true
    }

  export interface DepartmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Department'], meta: { name: 'Department' } }
    /**
     * Find zero or one Department that matches the filter.
     * @param {DepartmentFindUniqueArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DepartmentFindUniqueArgs>(args: SelectSubset<T, DepartmentFindUniqueArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Department that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DepartmentFindUniqueOrThrowArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DepartmentFindUniqueOrThrowArgs>(args: SelectSubset<T, DepartmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Department that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentFindFirstArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DepartmentFindFirstArgs>(args?: SelectSubset<T, DepartmentFindFirstArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Department that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentFindFirstOrThrowArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DepartmentFindFirstOrThrowArgs>(args?: SelectSubset<T, DepartmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Departments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Departments
     * const departments = await prisma.department.findMany()
     * 
     * // Get first 10 Departments
     * const departments = await prisma.department.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const departmentWithIdOnly = await prisma.department.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DepartmentFindManyArgs>(args?: SelectSubset<T, DepartmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Department.
     * @param {DepartmentCreateArgs} args - Arguments to create a Department.
     * @example
     * // Create one Department
     * const Department = await prisma.department.create({
     *   data: {
     *     // ... data to create a Department
     *   }
     * })
     * 
     */
    create<T extends DepartmentCreateArgs>(args: SelectSubset<T, DepartmentCreateArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Departments.
     * @param {DepartmentCreateManyArgs} args - Arguments to create many Departments.
     * @example
     * // Create many Departments
     * const department = await prisma.department.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DepartmentCreateManyArgs>(args?: SelectSubset<T, DepartmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Department.
     * @param {DepartmentDeleteArgs} args - Arguments to delete one Department.
     * @example
     * // Delete one Department
     * const Department = await prisma.department.delete({
     *   where: {
     *     // ... filter to delete one Department
     *   }
     * })
     * 
     */
    delete<T extends DepartmentDeleteArgs>(args: SelectSubset<T, DepartmentDeleteArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Department.
     * @param {DepartmentUpdateArgs} args - Arguments to update one Department.
     * @example
     * // Update one Department
     * const department = await prisma.department.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DepartmentUpdateArgs>(args: SelectSubset<T, DepartmentUpdateArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Departments.
     * @param {DepartmentDeleteManyArgs} args - Arguments to filter Departments to delete.
     * @example
     * // Delete a few Departments
     * const { count } = await prisma.department.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DepartmentDeleteManyArgs>(args?: SelectSubset<T, DepartmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Departments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Departments
     * const department = await prisma.department.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DepartmentUpdateManyArgs>(args: SelectSubset<T, DepartmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Department.
     * @param {DepartmentUpsertArgs} args - Arguments to update or create a Department.
     * @example
     * // Update or create a Department
     * const department = await prisma.department.upsert({
     *   create: {
     *     // ... data to create a Department
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Department we want to update
     *   }
     * })
     */
    upsert<T extends DepartmentUpsertArgs>(args: SelectSubset<T, DepartmentUpsertArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Departments that matches the filter.
     * @param {DepartmentFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const department = await prisma.department.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: DepartmentFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Department.
     * @param {DepartmentAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const department = await prisma.department.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: DepartmentAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Departments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentCountArgs} args - Arguments to filter Departments to count.
     * @example
     * // Count the number of Departments
     * const count = await prisma.department.count({
     *   where: {
     *     // ... the filter for the Departments we want to count
     *   }
     * })
    **/
    count<T extends DepartmentCountArgs>(
      args?: Subset<T, DepartmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DepartmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Department.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DepartmentAggregateArgs>(args: Subset<T, DepartmentAggregateArgs>): Prisma.PrismaPromise<GetDepartmentAggregateType<T>>

    /**
     * Group by Department.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DepartmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DepartmentGroupByArgs['orderBy'] }
        : { orderBy?: DepartmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DepartmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDepartmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Department model
   */
  readonly fields: DepartmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Department.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DepartmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Department model
   */
  interface DepartmentFieldRefs {
    readonly id: FieldRef<"Department", 'String'>
    readonly name: FieldRef<"Department", 'String'>
    readonly code: FieldRef<"Department", 'String'>
    readonly school: FieldRef<"Department", 'String'>
    readonly isActive: FieldRef<"Department", 'Boolean'>
    readonly createdAt: FieldRef<"Department", 'DateTime'>
    readonly updatedAt: FieldRef<"Department", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Department findUnique
   */
  export type DepartmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department findUniqueOrThrow
   */
  export type DepartmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department findFirst
   */
  export type DepartmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Departments.
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Departments.
     */
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Department findFirstOrThrow
   */
  export type DepartmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Departments.
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Departments.
     */
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Department findMany
   */
  export type DepartmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Filter, which Departments to fetch.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Departments.
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Department create
   */
  export type DepartmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * The data needed to create a Department.
     */
    data: XOR<DepartmentCreateInput, DepartmentUncheckedCreateInput>
  }

  /**
   * Department createMany
   */
  export type DepartmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Departments.
     */
    data: DepartmentCreateManyInput | DepartmentCreateManyInput[]
  }

  /**
   * Department update
   */
  export type DepartmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * The data needed to update a Department.
     */
    data: XOR<DepartmentUpdateInput, DepartmentUncheckedUpdateInput>
    /**
     * Choose, which Department to update.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department updateMany
   */
  export type DepartmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Departments.
     */
    data: XOR<DepartmentUpdateManyMutationInput, DepartmentUncheckedUpdateManyInput>
    /**
     * Filter which Departments to update
     */
    where?: DepartmentWhereInput
    /**
     * Limit how many Departments to update.
     */
    limit?: number
  }

  /**
   * Department upsert
   */
  export type DepartmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * The filter to search for the Department to update in case it exists.
     */
    where: DepartmentWhereUniqueInput
    /**
     * In case the Department found by the `where` argument doesn't exist, create a new Department with this data.
     */
    create: XOR<DepartmentCreateInput, DepartmentUncheckedCreateInput>
    /**
     * In case the Department was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DepartmentUpdateInput, DepartmentUncheckedUpdateInput>
  }

  /**
   * Department delete
   */
  export type DepartmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Filter which Department to delete.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department deleteMany
   */
  export type DepartmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Departments to delete
     */
    where?: DepartmentWhereInput
    /**
     * Limit how many Departments to delete.
     */
    limit?: number
  }

  /**
   * Department findRaw
   */
  export type DepartmentFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Department aggregateRaw
   */
  export type DepartmentAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Department without action
   */
  export type DepartmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
  }


  /**
   * Model Convocation
   */

  export type AggregateConvocation = {
    _count: ConvocationCountAggregateOutputType | null
    _avg: ConvocationAvgAggregateOutputType | null
    _sum: ConvocationSumAggregateOutputType | null
    _min: ConvocationMinAggregateOutputType | null
    _max: ConvocationMaxAggregateOutputType | null
  }

  export type ConvocationAvgAggregateOutputType = {
    maxAttendees: number | null
  }

  export type ConvocationSumAggregateOutputType = {
    maxAttendees: number | null
  }

  export type ConvocationMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    eventDate: Date | null
    registrationStartDate: Date | null
    registrationEndDate: Date | null
    venue: string | null
    isActive: boolean | null
    maxAttendees: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConvocationMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    eventDate: Date | null
    registrationStartDate: Date | null
    registrationEndDate: Date | null
    venue: string | null
    isActive: boolean | null
    maxAttendees: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConvocationCountAggregateOutputType = {
    id: number
    title: number
    description: number
    eventDate: number
    registrationStartDate: number
    registrationEndDate: number
    venue: number
    isActive: number
    maxAttendees: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ConvocationAvgAggregateInputType = {
    maxAttendees?: true
  }

  export type ConvocationSumAggregateInputType = {
    maxAttendees?: true
  }

  export type ConvocationMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    eventDate?: true
    registrationStartDate?: true
    registrationEndDate?: true
    venue?: true
    isActive?: true
    maxAttendees?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConvocationMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    eventDate?: true
    registrationStartDate?: true
    registrationEndDate?: true
    venue?: true
    isActive?: true
    maxAttendees?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConvocationCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    eventDate?: true
    registrationStartDate?: true
    registrationEndDate?: true
    venue?: true
    isActive?: true
    maxAttendees?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ConvocationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Convocation to aggregate.
     */
    where?: ConvocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Convocations to fetch.
     */
    orderBy?: ConvocationOrderByWithRelationInput | ConvocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConvocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Convocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Convocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Convocations
    **/
    _count?: true | ConvocationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ConvocationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ConvocationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConvocationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConvocationMaxAggregateInputType
  }

  export type GetConvocationAggregateType<T extends ConvocationAggregateArgs> = {
        [P in keyof T & keyof AggregateConvocation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConvocation[P]>
      : GetScalarType<T[P], AggregateConvocation[P]>
  }




  export type ConvocationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConvocationWhereInput
    orderBy?: ConvocationOrderByWithAggregationInput | ConvocationOrderByWithAggregationInput[]
    by: ConvocationScalarFieldEnum[] | ConvocationScalarFieldEnum
    having?: ConvocationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConvocationCountAggregateInputType | true
    _avg?: ConvocationAvgAggregateInputType
    _sum?: ConvocationSumAggregateInputType
    _min?: ConvocationMinAggregateInputType
    _max?: ConvocationMaxAggregateInputType
  }

  export type ConvocationGroupByOutputType = {
    id: string
    title: string
    description: string | null
    eventDate: Date
    registrationStartDate: Date
    registrationEndDate: Date
    venue: string
    isActive: boolean
    maxAttendees: number | null
    createdAt: Date
    updatedAt: Date
    _count: ConvocationCountAggregateOutputType | null
    _avg: ConvocationAvgAggregateOutputType | null
    _sum: ConvocationSumAggregateOutputType | null
    _min: ConvocationMinAggregateOutputType | null
    _max: ConvocationMaxAggregateOutputType | null
  }

  type GetConvocationGroupByPayload<T extends ConvocationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConvocationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConvocationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConvocationGroupByOutputType[P]>
            : GetScalarType<T[P], ConvocationGroupByOutputType[P]>
        }
      >
    >


  export type ConvocationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    eventDate?: boolean
    registrationStartDate?: boolean
    registrationEndDate?: boolean
    venue?: boolean
    isActive?: boolean
    maxAttendees?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["convocation"]>



  export type ConvocationSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    eventDate?: boolean
    registrationStartDate?: boolean
    registrationEndDate?: boolean
    venue?: boolean
    isActive?: boolean
    maxAttendees?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ConvocationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "eventDate" | "registrationStartDate" | "registrationEndDate" | "venue" | "isActive" | "maxAttendees" | "createdAt" | "updatedAt", ExtArgs["result"]["convocation"]>

  export type $ConvocationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Convocation"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string | null
      eventDate: Date
      registrationStartDate: Date
      registrationEndDate: Date
      venue: string
      isActive: boolean
      maxAttendees: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["convocation"]>
    composites: {}
  }

  type ConvocationGetPayload<S extends boolean | null | undefined | ConvocationDefaultArgs> = $Result.GetResult<Prisma.$ConvocationPayload, S>

  type ConvocationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConvocationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConvocationCountAggregateInputType | true
    }

  export interface ConvocationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Convocation'], meta: { name: 'Convocation' } }
    /**
     * Find zero or one Convocation that matches the filter.
     * @param {ConvocationFindUniqueArgs} args - Arguments to find a Convocation
     * @example
     * // Get one Convocation
     * const convocation = await prisma.convocation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConvocationFindUniqueArgs>(args: SelectSubset<T, ConvocationFindUniqueArgs<ExtArgs>>): Prisma__ConvocationClient<$Result.GetResult<Prisma.$ConvocationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Convocation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConvocationFindUniqueOrThrowArgs} args - Arguments to find a Convocation
     * @example
     * // Get one Convocation
     * const convocation = await prisma.convocation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConvocationFindUniqueOrThrowArgs>(args: SelectSubset<T, ConvocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConvocationClient<$Result.GetResult<Prisma.$ConvocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Convocation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConvocationFindFirstArgs} args - Arguments to find a Convocation
     * @example
     * // Get one Convocation
     * const convocation = await prisma.convocation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConvocationFindFirstArgs>(args?: SelectSubset<T, ConvocationFindFirstArgs<ExtArgs>>): Prisma__ConvocationClient<$Result.GetResult<Prisma.$ConvocationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Convocation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConvocationFindFirstOrThrowArgs} args - Arguments to find a Convocation
     * @example
     * // Get one Convocation
     * const convocation = await prisma.convocation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConvocationFindFirstOrThrowArgs>(args?: SelectSubset<T, ConvocationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConvocationClient<$Result.GetResult<Prisma.$ConvocationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Convocations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConvocationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Convocations
     * const convocations = await prisma.convocation.findMany()
     * 
     * // Get first 10 Convocations
     * const convocations = await prisma.convocation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const convocationWithIdOnly = await prisma.convocation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConvocationFindManyArgs>(args?: SelectSubset<T, ConvocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConvocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Convocation.
     * @param {ConvocationCreateArgs} args - Arguments to create a Convocation.
     * @example
     * // Create one Convocation
     * const Convocation = await prisma.convocation.create({
     *   data: {
     *     // ... data to create a Convocation
     *   }
     * })
     * 
     */
    create<T extends ConvocationCreateArgs>(args: SelectSubset<T, ConvocationCreateArgs<ExtArgs>>): Prisma__ConvocationClient<$Result.GetResult<Prisma.$ConvocationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Convocations.
     * @param {ConvocationCreateManyArgs} args - Arguments to create many Convocations.
     * @example
     * // Create many Convocations
     * const convocation = await prisma.convocation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConvocationCreateManyArgs>(args?: SelectSubset<T, ConvocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Convocation.
     * @param {ConvocationDeleteArgs} args - Arguments to delete one Convocation.
     * @example
     * // Delete one Convocation
     * const Convocation = await prisma.convocation.delete({
     *   where: {
     *     // ... filter to delete one Convocation
     *   }
     * })
     * 
     */
    delete<T extends ConvocationDeleteArgs>(args: SelectSubset<T, ConvocationDeleteArgs<ExtArgs>>): Prisma__ConvocationClient<$Result.GetResult<Prisma.$ConvocationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Convocation.
     * @param {ConvocationUpdateArgs} args - Arguments to update one Convocation.
     * @example
     * // Update one Convocation
     * const convocation = await prisma.convocation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConvocationUpdateArgs>(args: SelectSubset<T, ConvocationUpdateArgs<ExtArgs>>): Prisma__ConvocationClient<$Result.GetResult<Prisma.$ConvocationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Convocations.
     * @param {ConvocationDeleteManyArgs} args - Arguments to filter Convocations to delete.
     * @example
     * // Delete a few Convocations
     * const { count } = await prisma.convocation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConvocationDeleteManyArgs>(args?: SelectSubset<T, ConvocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Convocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConvocationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Convocations
     * const convocation = await prisma.convocation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConvocationUpdateManyArgs>(args: SelectSubset<T, ConvocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Convocation.
     * @param {ConvocationUpsertArgs} args - Arguments to update or create a Convocation.
     * @example
     * // Update or create a Convocation
     * const convocation = await prisma.convocation.upsert({
     *   create: {
     *     // ... data to create a Convocation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Convocation we want to update
     *   }
     * })
     */
    upsert<T extends ConvocationUpsertArgs>(args: SelectSubset<T, ConvocationUpsertArgs<ExtArgs>>): Prisma__ConvocationClient<$Result.GetResult<Prisma.$ConvocationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Convocations that matches the filter.
     * @param {ConvocationFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const convocation = await prisma.convocation.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: ConvocationFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Convocation.
     * @param {ConvocationAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const convocation = await prisma.convocation.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: ConvocationAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Convocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConvocationCountArgs} args - Arguments to filter Convocations to count.
     * @example
     * // Count the number of Convocations
     * const count = await prisma.convocation.count({
     *   where: {
     *     // ... the filter for the Convocations we want to count
     *   }
     * })
    **/
    count<T extends ConvocationCountArgs>(
      args?: Subset<T, ConvocationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConvocationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Convocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConvocationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConvocationAggregateArgs>(args: Subset<T, ConvocationAggregateArgs>): Prisma.PrismaPromise<GetConvocationAggregateType<T>>

    /**
     * Group by Convocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConvocationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConvocationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConvocationGroupByArgs['orderBy'] }
        : { orderBy?: ConvocationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConvocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConvocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Convocation model
   */
  readonly fields: ConvocationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Convocation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConvocationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Convocation model
   */
  interface ConvocationFieldRefs {
    readonly id: FieldRef<"Convocation", 'String'>
    readonly title: FieldRef<"Convocation", 'String'>
    readonly description: FieldRef<"Convocation", 'String'>
    readonly eventDate: FieldRef<"Convocation", 'DateTime'>
    readonly registrationStartDate: FieldRef<"Convocation", 'DateTime'>
    readonly registrationEndDate: FieldRef<"Convocation", 'DateTime'>
    readonly venue: FieldRef<"Convocation", 'String'>
    readonly isActive: FieldRef<"Convocation", 'Boolean'>
    readonly maxAttendees: FieldRef<"Convocation", 'Int'>
    readonly createdAt: FieldRef<"Convocation", 'DateTime'>
    readonly updatedAt: FieldRef<"Convocation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Convocation findUnique
   */
  export type ConvocationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Convocation
     */
    select?: ConvocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Convocation
     */
    omit?: ConvocationOmit<ExtArgs> | null
    /**
     * Filter, which Convocation to fetch.
     */
    where: ConvocationWhereUniqueInput
  }

  /**
   * Convocation findUniqueOrThrow
   */
  export type ConvocationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Convocation
     */
    select?: ConvocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Convocation
     */
    omit?: ConvocationOmit<ExtArgs> | null
    /**
     * Filter, which Convocation to fetch.
     */
    where: ConvocationWhereUniqueInput
  }

  /**
   * Convocation findFirst
   */
  export type ConvocationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Convocation
     */
    select?: ConvocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Convocation
     */
    omit?: ConvocationOmit<ExtArgs> | null
    /**
     * Filter, which Convocation to fetch.
     */
    where?: ConvocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Convocations to fetch.
     */
    orderBy?: ConvocationOrderByWithRelationInput | ConvocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Convocations.
     */
    cursor?: ConvocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Convocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Convocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Convocations.
     */
    distinct?: ConvocationScalarFieldEnum | ConvocationScalarFieldEnum[]
  }

  /**
   * Convocation findFirstOrThrow
   */
  export type ConvocationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Convocation
     */
    select?: ConvocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Convocation
     */
    omit?: ConvocationOmit<ExtArgs> | null
    /**
     * Filter, which Convocation to fetch.
     */
    where?: ConvocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Convocations to fetch.
     */
    orderBy?: ConvocationOrderByWithRelationInput | ConvocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Convocations.
     */
    cursor?: ConvocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Convocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Convocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Convocations.
     */
    distinct?: ConvocationScalarFieldEnum | ConvocationScalarFieldEnum[]
  }

  /**
   * Convocation findMany
   */
  export type ConvocationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Convocation
     */
    select?: ConvocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Convocation
     */
    omit?: ConvocationOmit<ExtArgs> | null
    /**
     * Filter, which Convocations to fetch.
     */
    where?: ConvocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Convocations to fetch.
     */
    orderBy?: ConvocationOrderByWithRelationInput | ConvocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Convocations.
     */
    cursor?: ConvocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Convocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Convocations.
     */
    skip?: number
    distinct?: ConvocationScalarFieldEnum | ConvocationScalarFieldEnum[]
  }

  /**
   * Convocation create
   */
  export type ConvocationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Convocation
     */
    select?: ConvocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Convocation
     */
    omit?: ConvocationOmit<ExtArgs> | null
    /**
     * The data needed to create a Convocation.
     */
    data: XOR<ConvocationCreateInput, ConvocationUncheckedCreateInput>
  }

  /**
   * Convocation createMany
   */
  export type ConvocationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Convocations.
     */
    data: ConvocationCreateManyInput | ConvocationCreateManyInput[]
  }

  /**
   * Convocation update
   */
  export type ConvocationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Convocation
     */
    select?: ConvocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Convocation
     */
    omit?: ConvocationOmit<ExtArgs> | null
    /**
     * The data needed to update a Convocation.
     */
    data: XOR<ConvocationUpdateInput, ConvocationUncheckedUpdateInput>
    /**
     * Choose, which Convocation to update.
     */
    where: ConvocationWhereUniqueInput
  }

  /**
   * Convocation updateMany
   */
  export type ConvocationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Convocations.
     */
    data: XOR<ConvocationUpdateManyMutationInput, ConvocationUncheckedUpdateManyInput>
    /**
     * Filter which Convocations to update
     */
    where?: ConvocationWhereInput
    /**
     * Limit how many Convocations to update.
     */
    limit?: number
  }

  /**
   * Convocation upsert
   */
  export type ConvocationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Convocation
     */
    select?: ConvocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Convocation
     */
    omit?: ConvocationOmit<ExtArgs> | null
    /**
     * The filter to search for the Convocation to update in case it exists.
     */
    where: ConvocationWhereUniqueInput
    /**
     * In case the Convocation found by the `where` argument doesn't exist, create a new Convocation with this data.
     */
    create: XOR<ConvocationCreateInput, ConvocationUncheckedCreateInput>
    /**
     * In case the Convocation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConvocationUpdateInput, ConvocationUncheckedUpdateInput>
  }

  /**
   * Convocation delete
   */
  export type ConvocationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Convocation
     */
    select?: ConvocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Convocation
     */
    omit?: ConvocationOmit<ExtArgs> | null
    /**
     * Filter which Convocation to delete.
     */
    where: ConvocationWhereUniqueInput
  }

  /**
   * Convocation deleteMany
   */
  export type ConvocationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Convocations to delete
     */
    where?: ConvocationWhereInput
    /**
     * Limit how many Convocations to delete.
     */
    limit?: number
  }

  /**
   * Convocation findRaw
   */
  export type ConvocationFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Convocation aggregateRaw
   */
  export type ConvocationAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Convocation without action
   */
  export type ConvocationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Convocation
     */
    select?: ConvocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Convocation
     */
    omit?: ConvocationOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const AccountScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    firstName: 'firstName',
    lastName: 'lastName',
    displayName: 'displayName',
    profileImageURL: 'profileImageURL',
    role: 'role',
    assignedIAMPolicies: 'assignedIAMPolicies',
    accountState: 'accountState',
    isActive: 'isActive',
    lastLoginAt: 'lastLoginAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const AttendeeScalarFieldEnum: {
    id: 'id',
    enrollmentId: 'enrollmentId',
    name: 'name',
    course: 'course',
    school: 'school',
    degree: 'degree',
    email: 'email',
    phone: 'phone',
    convocationEligible: 'convocationEligible',
    convocationRegistered: 'convocationRegistered',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    crr: 'crr',
    enclosure: 'enclosure',
    accountId: 'accountId'
  };

  export type AttendeeScalarFieldEnum = (typeof AttendeeScalarFieldEnum)[keyof typeof AttendeeScalarFieldEnum]


  export const SeatAllocationScalarFieldEnum: {
    id: 'id',
    enclosure: 'enclosure',
    row: 'row',
    seat: 'seat',
    allocatedAt: 'allocatedAt',
    attendeeId: 'attendeeId'
  };

  export type SeatAllocationScalarFieldEnum = (typeof SeatAllocationScalarFieldEnum)[keyof typeof SeatAllocationScalarFieldEnum]


  export const EnclosureScalarFieldEnum: {
    id: 'id',
    letter: 'letter',
    allocatedFor: 'allocatedFor',
    entryDirection: 'entryDirection'
  };

  export type EnclosureScalarFieldEnum = (typeof EnclosureScalarFieldEnum)[keyof typeof EnclosureScalarFieldEnum]


  export const RowScalarFieldEnum: {
    id: 'id',
    letter: 'letter',
    startSeat: 'startSeat',
    endSeat: 'endSeat',
    reserved: 'reserved',
    enclosureId: 'enclosureId'
  };

  export type RowScalarFieldEnum = (typeof RowScalarFieldEnum)[keyof typeof RowScalarFieldEnum]


  export const AnalyticsScalarFieldEnum: {
    id: 'id',
    date: 'date',
    visitors: 'visitors',
    pageViews: 'pageViews',
    uniqueVisitors: 'uniqueVisitors',
    countries: 'countries',
    languages: 'languages',
    devices: 'devices',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AnalyticsScalarFieldEnum = (typeof AnalyticsScalarFieldEnum)[keyof typeof AnalyticsScalarFieldEnum]


  export const IAMPolicyScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    permissions: 'permissions',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type IAMPolicyScalarFieldEnum = (typeof IAMPolicyScalarFieldEnum)[keyof typeof IAMPolicyScalarFieldEnum]


  export const DepartmentScalarFieldEnum: {
    id: 'id',
    name: 'name',
    code: 'code',
    school: 'school',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DepartmentScalarFieldEnum = (typeof DepartmentScalarFieldEnum)[keyof typeof DepartmentScalarFieldEnum]


  export const ConvocationScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    eventDate: 'eventDate',
    registrationStartDate: 'registrationStartDate',
    registrationEndDate: 'registrationEndDate',
    venue: 'venue',
    isActive: 'isActive',
    maxAttendees: 'maxAttendees',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ConvocationScalarFieldEnum = (typeof ConvocationScalarFieldEnum)[keyof typeof ConvocationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'AccountState'
   */
  export type EnumAccountStateFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AccountState'>
    


  /**
   * Reference to a field of type 'AccountState[]'
   */
  export type ListEnumAccountStateFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AccountState[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'EnclosureType'
   */
  export type EnumEnclosureTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EnclosureType'>
    


  /**
   * Reference to a field of type 'EnclosureType[]'
   */
  export type ListEnumEnclosureTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EnclosureType[]'>
    


  /**
   * Reference to a field of type 'Direction'
   */
  export type EnumDirectionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Direction'>
    


  /**
   * Reference to a field of type 'Direction[]'
   */
  export type ListEnumDirectionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Direction[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    email?: StringFilter<"Account"> | string
    password?: StringFilter<"Account"> | string
    firstName?: StringFilter<"Account"> | string
    lastName?: StringFilter<"Account"> | string
    displayName?: StringFilter<"Account"> | string
    profileImageURL?: StringNullableFilter<"Account"> | string | null
    role?: EnumUserRoleFilter<"Account"> | $Enums.UserRole
    assignedIAMPolicies?: StringNullableListFilter<"Account">
    accountState?: EnumAccountStateFilter<"Account"> | $Enums.AccountState
    isActive?: BoolFilter<"Account"> | boolean
    lastLoginAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    attendees?: AttendeeListRelationFilter
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    displayName?: SortOrder
    profileImageURL?: SortOrder
    role?: SortOrder
    assignedIAMPolicies?: SortOrder
    accountState?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    attendees?: AttendeeOrderByRelationAggregateInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    password?: StringFilter<"Account"> | string
    firstName?: StringFilter<"Account"> | string
    lastName?: StringFilter<"Account"> | string
    displayName?: StringFilter<"Account"> | string
    profileImageURL?: StringNullableFilter<"Account"> | string | null
    role?: EnumUserRoleFilter<"Account"> | $Enums.UserRole
    assignedIAMPolicies?: StringNullableListFilter<"Account">
    accountState?: EnumAccountStateFilter<"Account"> | $Enums.AccountState
    isActive?: BoolFilter<"Account"> | boolean
    lastLoginAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    attendees?: AttendeeListRelationFilter
  }, "id" | "email">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    displayName?: SortOrder
    profileImageURL?: SortOrder
    role?: SortOrder
    assignedIAMPolicies?: SortOrder
    accountState?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    email?: StringWithAggregatesFilter<"Account"> | string
    password?: StringWithAggregatesFilter<"Account"> | string
    firstName?: StringWithAggregatesFilter<"Account"> | string
    lastName?: StringWithAggregatesFilter<"Account"> | string
    displayName?: StringWithAggregatesFilter<"Account"> | string
    profileImageURL?: StringNullableWithAggregatesFilter<"Account"> | string | null
    role?: EnumUserRoleWithAggregatesFilter<"Account"> | $Enums.UserRole
    assignedIAMPolicies?: StringNullableListFilter<"Account">
    accountState?: EnumAccountStateWithAggregatesFilter<"Account"> | $Enums.AccountState
    isActive?: BoolWithAggregatesFilter<"Account"> | boolean
    lastLoginAt?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
  }

  export type AttendeeWhereInput = {
    AND?: AttendeeWhereInput | AttendeeWhereInput[]
    OR?: AttendeeWhereInput[]
    NOT?: AttendeeWhereInput | AttendeeWhereInput[]
    id?: StringFilter<"Attendee"> | string
    enrollmentId?: StringFilter<"Attendee"> | string
    name?: StringFilter<"Attendee"> | string
    course?: StringFilter<"Attendee"> | string
    school?: StringFilter<"Attendee"> | string
    degree?: StringFilter<"Attendee"> | string
    email?: StringNullableFilter<"Attendee"> | string | null
    phone?: StringNullableFilter<"Attendee"> | string | null
    convocationEligible?: BoolFilter<"Attendee"> | boolean
    convocationRegistered?: BoolFilter<"Attendee"> | boolean
    createdAt?: DateTimeFilter<"Attendee"> | Date | string
    updatedAt?: DateTimeFilter<"Attendee"> | Date | string
    crr?: StringFilter<"Attendee"> | string
    enclosure?: StringFilter<"Attendee"> | string
    accountId?: StringNullableFilter<"Attendee"> | string | null
    account?: XOR<AccountNullableScalarRelationFilter, AccountWhereInput> | null
    allocation?: XOR<SeatAllocationNullableScalarRelationFilter, SeatAllocationWhereInput> | null
  }

  export type AttendeeOrderByWithRelationInput = {
    id?: SortOrder
    enrollmentId?: SortOrder
    name?: SortOrder
    course?: SortOrder
    school?: SortOrder
    degree?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    convocationEligible?: SortOrder
    convocationRegistered?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    crr?: SortOrder
    enclosure?: SortOrder
    accountId?: SortOrder
    account?: AccountOrderByWithRelationInput
    allocation?: SeatAllocationOrderByWithRelationInput
  }

  export type AttendeeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    enrollmentId?: string
    AND?: AttendeeWhereInput | AttendeeWhereInput[]
    OR?: AttendeeWhereInput[]
    NOT?: AttendeeWhereInput | AttendeeWhereInput[]
    name?: StringFilter<"Attendee"> | string
    course?: StringFilter<"Attendee"> | string
    school?: StringFilter<"Attendee"> | string
    degree?: StringFilter<"Attendee"> | string
    email?: StringNullableFilter<"Attendee"> | string | null
    phone?: StringNullableFilter<"Attendee"> | string | null
    convocationEligible?: BoolFilter<"Attendee"> | boolean
    convocationRegistered?: BoolFilter<"Attendee"> | boolean
    createdAt?: DateTimeFilter<"Attendee"> | Date | string
    updatedAt?: DateTimeFilter<"Attendee"> | Date | string
    crr?: StringFilter<"Attendee"> | string
    enclosure?: StringFilter<"Attendee"> | string
    accountId?: StringNullableFilter<"Attendee"> | string | null
    account?: XOR<AccountNullableScalarRelationFilter, AccountWhereInput> | null
    allocation?: XOR<SeatAllocationNullableScalarRelationFilter, SeatAllocationWhereInput> | null
  }, "id" | "enrollmentId">

  export type AttendeeOrderByWithAggregationInput = {
    id?: SortOrder
    enrollmentId?: SortOrder
    name?: SortOrder
    course?: SortOrder
    school?: SortOrder
    degree?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    convocationEligible?: SortOrder
    convocationRegistered?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    crr?: SortOrder
    enclosure?: SortOrder
    accountId?: SortOrder
    _count?: AttendeeCountOrderByAggregateInput
    _max?: AttendeeMaxOrderByAggregateInput
    _min?: AttendeeMinOrderByAggregateInput
  }

  export type AttendeeScalarWhereWithAggregatesInput = {
    AND?: AttendeeScalarWhereWithAggregatesInput | AttendeeScalarWhereWithAggregatesInput[]
    OR?: AttendeeScalarWhereWithAggregatesInput[]
    NOT?: AttendeeScalarWhereWithAggregatesInput | AttendeeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Attendee"> | string
    enrollmentId?: StringWithAggregatesFilter<"Attendee"> | string
    name?: StringWithAggregatesFilter<"Attendee"> | string
    course?: StringWithAggregatesFilter<"Attendee"> | string
    school?: StringWithAggregatesFilter<"Attendee"> | string
    degree?: StringWithAggregatesFilter<"Attendee"> | string
    email?: StringNullableWithAggregatesFilter<"Attendee"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Attendee"> | string | null
    convocationEligible?: BoolWithAggregatesFilter<"Attendee"> | boolean
    convocationRegistered?: BoolWithAggregatesFilter<"Attendee"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Attendee"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Attendee"> | Date | string
    crr?: StringWithAggregatesFilter<"Attendee"> | string
    enclosure?: StringWithAggregatesFilter<"Attendee"> | string
    accountId?: StringNullableWithAggregatesFilter<"Attendee"> | string | null
  }

  export type SeatAllocationWhereInput = {
    AND?: SeatAllocationWhereInput | SeatAllocationWhereInput[]
    OR?: SeatAllocationWhereInput[]
    NOT?: SeatAllocationWhereInput | SeatAllocationWhereInput[]
    id?: StringFilter<"SeatAllocation"> | string
    enclosure?: StringFilter<"SeatAllocation"> | string
    row?: StringFilter<"SeatAllocation"> | string
    seat?: IntFilter<"SeatAllocation"> | number
    allocatedAt?: DateTimeFilter<"SeatAllocation"> | Date | string
    attendeeId?: StringFilter<"SeatAllocation"> | string
    attendee?: XOR<AttendeeScalarRelationFilter, AttendeeWhereInput>
  }

  export type SeatAllocationOrderByWithRelationInput = {
    id?: SortOrder
    enclosure?: SortOrder
    row?: SortOrder
    seat?: SortOrder
    allocatedAt?: SortOrder
    attendeeId?: SortOrder
    attendee?: AttendeeOrderByWithRelationInput
  }

  export type SeatAllocationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    attendeeId?: string
    AND?: SeatAllocationWhereInput | SeatAllocationWhereInput[]
    OR?: SeatAllocationWhereInput[]
    NOT?: SeatAllocationWhereInput | SeatAllocationWhereInput[]
    enclosure?: StringFilter<"SeatAllocation"> | string
    row?: StringFilter<"SeatAllocation"> | string
    seat?: IntFilter<"SeatAllocation"> | number
    allocatedAt?: DateTimeFilter<"SeatAllocation"> | Date | string
    attendee?: XOR<AttendeeScalarRelationFilter, AttendeeWhereInput>
  }, "id" | "attendeeId">

  export type SeatAllocationOrderByWithAggregationInput = {
    id?: SortOrder
    enclosure?: SortOrder
    row?: SortOrder
    seat?: SortOrder
    allocatedAt?: SortOrder
    attendeeId?: SortOrder
    _count?: SeatAllocationCountOrderByAggregateInput
    _avg?: SeatAllocationAvgOrderByAggregateInput
    _max?: SeatAllocationMaxOrderByAggregateInput
    _min?: SeatAllocationMinOrderByAggregateInput
    _sum?: SeatAllocationSumOrderByAggregateInput
  }

  export type SeatAllocationScalarWhereWithAggregatesInput = {
    AND?: SeatAllocationScalarWhereWithAggregatesInput | SeatAllocationScalarWhereWithAggregatesInput[]
    OR?: SeatAllocationScalarWhereWithAggregatesInput[]
    NOT?: SeatAllocationScalarWhereWithAggregatesInput | SeatAllocationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SeatAllocation"> | string
    enclosure?: StringWithAggregatesFilter<"SeatAllocation"> | string
    row?: StringWithAggregatesFilter<"SeatAllocation"> | string
    seat?: IntWithAggregatesFilter<"SeatAllocation"> | number
    allocatedAt?: DateTimeWithAggregatesFilter<"SeatAllocation"> | Date | string
    attendeeId?: StringWithAggregatesFilter<"SeatAllocation"> | string
  }

  export type EnclosureWhereInput = {
    AND?: EnclosureWhereInput | EnclosureWhereInput[]
    OR?: EnclosureWhereInput[]
    NOT?: EnclosureWhereInput | EnclosureWhereInput[]
    id?: StringFilter<"Enclosure"> | string
    letter?: StringFilter<"Enclosure"> | string
    allocatedFor?: EnumEnclosureTypeFilter<"Enclosure"> | $Enums.EnclosureType
    entryDirection?: EnumDirectionFilter<"Enclosure"> | $Enums.Direction
    rows?: RowListRelationFilter
  }

  export type EnclosureOrderByWithRelationInput = {
    id?: SortOrder
    letter?: SortOrder
    allocatedFor?: SortOrder
    entryDirection?: SortOrder
    rows?: RowOrderByRelationAggregateInput
  }

  export type EnclosureWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EnclosureWhereInput | EnclosureWhereInput[]
    OR?: EnclosureWhereInput[]
    NOT?: EnclosureWhereInput | EnclosureWhereInput[]
    letter?: StringFilter<"Enclosure"> | string
    allocatedFor?: EnumEnclosureTypeFilter<"Enclosure"> | $Enums.EnclosureType
    entryDirection?: EnumDirectionFilter<"Enclosure"> | $Enums.Direction
    rows?: RowListRelationFilter
  }, "id">

  export type EnclosureOrderByWithAggregationInput = {
    id?: SortOrder
    letter?: SortOrder
    allocatedFor?: SortOrder
    entryDirection?: SortOrder
    _count?: EnclosureCountOrderByAggregateInput
    _max?: EnclosureMaxOrderByAggregateInput
    _min?: EnclosureMinOrderByAggregateInput
  }

  export type EnclosureScalarWhereWithAggregatesInput = {
    AND?: EnclosureScalarWhereWithAggregatesInput | EnclosureScalarWhereWithAggregatesInput[]
    OR?: EnclosureScalarWhereWithAggregatesInput[]
    NOT?: EnclosureScalarWhereWithAggregatesInput | EnclosureScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Enclosure"> | string
    letter?: StringWithAggregatesFilter<"Enclosure"> | string
    allocatedFor?: EnumEnclosureTypeWithAggregatesFilter<"Enclosure"> | $Enums.EnclosureType
    entryDirection?: EnumDirectionWithAggregatesFilter<"Enclosure"> | $Enums.Direction
  }

  export type RowWhereInput = {
    AND?: RowWhereInput | RowWhereInput[]
    OR?: RowWhereInput[]
    NOT?: RowWhereInput | RowWhereInput[]
    id?: StringFilter<"Row"> | string
    letter?: StringFilter<"Row"> | string
    startSeat?: IntFilter<"Row"> | number
    endSeat?: IntFilter<"Row"> | number
    reserved?: StringFilter<"Row"> | string
    enclosureId?: StringFilter<"Row"> | string
    enclosure?: XOR<EnclosureScalarRelationFilter, EnclosureWhereInput>
  }

  export type RowOrderByWithRelationInput = {
    id?: SortOrder
    letter?: SortOrder
    startSeat?: SortOrder
    endSeat?: SortOrder
    reserved?: SortOrder
    enclosureId?: SortOrder
    enclosure?: EnclosureOrderByWithRelationInput
  }

  export type RowWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RowWhereInput | RowWhereInput[]
    OR?: RowWhereInput[]
    NOT?: RowWhereInput | RowWhereInput[]
    letter?: StringFilter<"Row"> | string
    startSeat?: IntFilter<"Row"> | number
    endSeat?: IntFilter<"Row"> | number
    reserved?: StringFilter<"Row"> | string
    enclosureId?: StringFilter<"Row"> | string
    enclosure?: XOR<EnclosureScalarRelationFilter, EnclosureWhereInput>
  }, "id">

  export type RowOrderByWithAggregationInput = {
    id?: SortOrder
    letter?: SortOrder
    startSeat?: SortOrder
    endSeat?: SortOrder
    reserved?: SortOrder
    enclosureId?: SortOrder
    _count?: RowCountOrderByAggregateInput
    _avg?: RowAvgOrderByAggregateInput
    _max?: RowMaxOrderByAggregateInput
    _min?: RowMinOrderByAggregateInput
    _sum?: RowSumOrderByAggregateInput
  }

  export type RowScalarWhereWithAggregatesInput = {
    AND?: RowScalarWhereWithAggregatesInput | RowScalarWhereWithAggregatesInput[]
    OR?: RowScalarWhereWithAggregatesInput[]
    NOT?: RowScalarWhereWithAggregatesInput | RowScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Row"> | string
    letter?: StringWithAggregatesFilter<"Row"> | string
    startSeat?: IntWithAggregatesFilter<"Row"> | number
    endSeat?: IntWithAggregatesFilter<"Row"> | number
    reserved?: StringWithAggregatesFilter<"Row"> | string
    enclosureId?: StringWithAggregatesFilter<"Row"> | string
  }

  export type AnalyticsWhereInput = {
    AND?: AnalyticsWhereInput | AnalyticsWhereInput[]
    OR?: AnalyticsWhereInput[]
    NOT?: AnalyticsWhereInput | AnalyticsWhereInput[]
    id?: StringFilter<"Analytics"> | string
    date?: DateTimeFilter<"Analytics"> | Date | string
    visitors?: IntFilter<"Analytics"> | number
    pageViews?: IntFilter<"Analytics"> | number
    uniqueVisitors?: IntFilter<"Analytics"> | number
    countries?: JsonFilter<"Analytics">
    languages?: JsonFilter<"Analytics">
    devices?: JsonFilter<"Analytics">
    createdAt?: DateTimeFilter<"Analytics"> | Date | string
    updatedAt?: DateTimeFilter<"Analytics"> | Date | string
  }

  export type AnalyticsOrderByWithRelationInput = {
    id?: SortOrder
    date?: SortOrder
    visitors?: SortOrder
    pageViews?: SortOrder
    uniqueVisitors?: SortOrder
    countries?: SortOrder
    languages?: SortOrder
    devices?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AnalyticsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    date?: Date | string
    AND?: AnalyticsWhereInput | AnalyticsWhereInput[]
    OR?: AnalyticsWhereInput[]
    NOT?: AnalyticsWhereInput | AnalyticsWhereInput[]
    visitors?: IntFilter<"Analytics"> | number
    pageViews?: IntFilter<"Analytics"> | number
    uniqueVisitors?: IntFilter<"Analytics"> | number
    countries?: JsonFilter<"Analytics">
    languages?: JsonFilter<"Analytics">
    devices?: JsonFilter<"Analytics">
    createdAt?: DateTimeFilter<"Analytics"> | Date | string
    updatedAt?: DateTimeFilter<"Analytics"> | Date | string
  }, "id" | "date">

  export type AnalyticsOrderByWithAggregationInput = {
    id?: SortOrder
    date?: SortOrder
    visitors?: SortOrder
    pageViews?: SortOrder
    uniqueVisitors?: SortOrder
    countries?: SortOrder
    languages?: SortOrder
    devices?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AnalyticsCountOrderByAggregateInput
    _avg?: AnalyticsAvgOrderByAggregateInput
    _max?: AnalyticsMaxOrderByAggregateInput
    _min?: AnalyticsMinOrderByAggregateInput
    _sum?: AnalyticsSumOrderByAggregateInput
  }

  export type AnalyticsScalarWhereWithAggregatesInput = {
    AND?: AnalyticsScalarWhereWithAggregatesInput | AnalyticsScalarWhereWithAggregatesInput[]
    OR?: AnalyticsScalarWhereWithAggregatesInput[]
    NOT?: AnalyticsScalarWhereWithAggregatesInput | AnalyticsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Analytics"> | string
    date?: DateTimeWithAggregatesFilter<"Analytics"> | Date | string
    visitors?: IntWithAggregatesFilter<"Analytics"> | number
    pageViews?: IntWithAggregatesFilter<"Analytics"> | number
    uniqueVisitors?: IntWithAggregatesFilter<"Analytics"> | number
    countries?: JsonWithAggregatesFilter<"Analytics">
    languages?: JsonWithAggregatesFilter<"Analytics">
    devices?: JsonWithAggregatesFilter<"Analytics">
    createdAt?: DateTimeWithAggregatesFilter<"Analytics"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Analytics"> | Date | string
  }

  export type IAMPolicyWhereInput = {
    AND?: IAMPolicyWhereInput | IAMPolicyWhereInput[]
    OR?: IAMPolicyWhereInput[]
    NOT?: IAMPolicyWhereInput | IAMPolicyWhereInput[]
    id?: StringFilter<"IAMPolicy"> | string
    name?: StringFilter<"IAMPolicy"> | string
    description?: StringFilter<"IAMPolicy"> | string
    permissions?: StringNullableListFilter<"IAMPolicy">
    createdAt?: DateTimeFilter<"IAMPolicy"> | Date | string
    updatedAt?: DateTimeFilter<"IAMPolicy"> | Date | string
  }

  export type IAMPolicyOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    permissions?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IAMPolicyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: IAMPolicyWhereInput | IAMPolicyWhereInput[]
    OR?: IAMPolicyWhereInput[]
    NOT?: IAMPolicyWhereInput | IAMPolicyWhereInput[]
    description?: StringFilter<"IAMPolicy"> | string
    permissions?: StringNullableListFilter<"IAMPolicy">
    createdAt?: DateTimeFilter<"IAMPolicy"> | Date | string
    updatedAt?: DateTimeFilter<"IAMPolicy"> | Date | string
  }, "id" | "name">

  export type IAMPolicyOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    permissions?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: IAMPolicyCountOrderByAggregateInput
    _max?: IAMPolicyMaxOrderByAggregateInput
    _min?: IAMPolicyMinOrderByAggregateInput
  }

  export type IAMPolicyScalarWhereWithAggregatesInput = {
    AND?: IAMPolicyScalarWhereWithAggregatesInput | IAMPolicyScalarWhereWithAggregatesInput[]
    OR?: IAMPolicyScalarWhereWithAggregatesInput[]
    NOT?: IAMPolicyScalarWhereWithAggregatesInput | IAMPolicyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"IAMPolicy"> | string
    name?: StringWithAggregatesFilter<"IAMPolicy"> | string
    description?: StringWithAggregatesFilter<"IAMPolicy"> | string
    permissions?: StringNullableListFilter<"IAMPolicy">
    createdAt?: DateTimeWithAggregatesFilter<"IAMPolicy"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"IAMPolicy"> | Date | string
  }

  export type DepartmentWhereInput = {
    AND?: DepartmentWhereInput | DepartmentWhereInput[]
    OR?: DepartmentWhereInput[]
    NOT?: DepartmentWhereInput | DepartmentWhereInput[]
    id?: StringFilter<"Department"> | string
    name?: StringFilter<"Department"> | string
    code?: StringFilter<"Department"> | string
    school?: StringFilter<"Department"> | string
    isActive?: BoolFilter<"Department"> | boolean
    createdAt?: DateTimeFilter<"Department"> | Date | string
    updatedAt?: DateTimeFilter<"Department"> | Date | string
  }

  export type DepartmentOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    school?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DepartmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    code?: string
    AND?: DepartmentWhereInput | DepartmentWhereInput[]
    OR?: DepartmentWhereInput[]
    NOT?: DepartmentWhereInput | DepartmentWhereInput[]
    school?: StringFilter<"Department"> | string
    isActive?: BoolFilter<"Department"> | boolean
    createdAt?: DateTimeFilter<"Department"> | Date | string
    updatedAt?: DateTimeFilter<"Department"> | Date | string
  }, "id" | "name" | "code">

  export type DepartmentOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    school?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DepartmentCountOrderByAggregateInput
    _max?: DepartmentMaxOrderByAggregateInput
    _min?: DepartmentMinOrderByAggregateInput
  }

  export type DepartmentScalarWhereWithAggregatesInput = {
    AND?: DepartmentScalarWhereWithAggregatesInput | DepartmentScalarWhereWithAggregatesInput[]
    OR?: DepartmentScalarWhereWithAggregatesInput[]
    NOT?: DepartmentScalarWhereWithAggregatesInput | DepartmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Department"> | string
    name?: StringWithAggregatesFilter<"Department"> | string
    code?: StringWithAggregatesFilter<"Department"> | string
    school?: StringWithAggregatesFilter<"Department"> | string
    isActive?: BoolWithAggregatesFilter<"Department"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Department"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Department"> | Date | string
  }

  export type ConvocationWhereInput = {
    AND?: ConvocationWhereInput | ConvocationWhereInput[]
    OR?: ConvocationWhereInput[]
    NOT?: ConvocationWhereInput | ConvocationWhereInput[]
    id?: StringFilter<"Convocation"> | string
    title?: StringFilter<"Convocation"> | string
    description?: StringNullableFilter<"Convocation"> | string | null
    eventDate?: DateTimeFilter<"Convocation"> | Date | string
    registrationStartDate?: DateTimeFilter<"Convocation"> | Date | string
    registrationEndDate?: DateTimeFilter<"Convocation"> | Date | string
    venue?: StringFilter<"Convocation"> | string
    isActive?: BoolFilter<"Convocation"> | boolean
    maxAttendees?: IntNullableFilter<"Convocation"> | number | null
    createdAt?: DateTimeFilter<"Convocation"> | Date | string
    updatedAt?: DateTimeFilter<"Convocation"> | Date | string
  }

  export type ConvocationOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    eventDate?: SortOrder
    registrationStartDate?: SortOrder
    registrationEndDate?: SortOrder
    venue?: SortOrder
    isActive?: SortOrder
    maxAttendees?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConvocationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ConvocationWhereInput | ConvocationWhereInput[]
    OR?: ConvocationWhereInput[]
    NOT?: ConvocationWhereInput | ConvocationWhereInput[]
    title?: StringFilter<"Convocation"> | string
    description?: StringNullableFilter<"Convocation"> | string | null
    eventDate?: DateTimeFilter<"Convocation"> | Date | string
    registrationStartDate?: DateTimeFilter<"Convocation"> | Date | string
    registrationEndDate?: DateTimeFilter<"Convocation"> | Date | string
    venue?: StringFilter<"Convocation"> | string
    isActive?: BoolFilter<"Convocation"> | boolean
    maxAttendees?: IntNullableFilter<"Convocation"> | number | null
    createdAt?: DateTimeFilter<"Convocation"> | Date | string
    updatedAt?: DateTimeFilter<"Convocation"> | Date | string
  }, "id">

  export type ConvocationOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    eventDate?: SortOrder
    registrationStartDate?: SortOrder
    registrationEndDate?: SortOrder
    venue?: SortOrder
    isActive?: SortOrder
    maxAttendees?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ConvocationCountOrderByAggregateInput
    _avg?: ConvocationAvgOrderByAggregateInput
    _max?: ConvocationMaxOrderByAggregateInput
    _min?: ConvocationMinOrderByAggregateInput
    _sum?: ConvocationSumOrderByAggregateInput
  }

  export type ConvocationScalarWhereWithAggregatesInput = {
    AND?: ConvocationScalarWhereWithAggregatesInput | ConvocationScalarWhereWithAggregatesInput[]
    OR?: ConvocationScalarWhereWithAggregatesInput[]
    NOT?: ConvocationScalarWhereWithAggregatesInput | ConvocationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Convocation"> | string
    title?: StringWithAggregatesFilter<"Convocation"> | string
    description?: StringNullableWithAggregatesFilter<"Convocation"> | string | null
    eventDate?: DateTimeWithAggregatesFilter<"Convocation"> | Date | string
    registrationStartDate?: DateTimeWithAggregatesFilter<"Convocation"> | Date | string
    registrationEndDate?: DateTimeWithAggregatesFilter<"Convocation"> | Date | string
    venue?: StringWithAggregatesFilter<"Convocation"> | string
    isActive?: BoolWithAggregatesFilter<"Convocation"> | boolean
    maxAttendees?: IntNullableWithAggregatesFilter<"Convocation"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Convocation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Convocation"> | Date | string
  }

  export type AccountCreateInput = {
    id?: string
    email: string
    password: string
    firstName: string
    lastName: string
    displayName: string
    profileImageURL?: string | null
    role?: $Enums.UserRole
    assignedIAMPolicies?: AccountCreateassignedIAMPoliciesInput | string[]
    accountState?: $Enums.AccountState
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attendees?: AttendeeCreateNestedManyWithoutAccountInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    email: string
    password: string
    firstName: string
    lastName: string
    displayName: string
    profileImageURL?: string | null
    role?: $Enums.UserRole
    assignedIAMPolicies?: AccountCreateassignedIAMPoliciesInput | string[]
    accountState?: $Enums.AccountState
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attendees?: AttendeeUncheckedCreateNestedManyWithoutAccountInput
  }

  export type AccountUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    profileImageURL?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    assignedIAMPolicies?: AccountUpdateassignedIAMPoliciesInput | string[]
    accountState?: EnumAccountStateFieldUpdateOperationsInput | $Enums.AccountState
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attendees?: AttendeeUpdateManyWithoutAccountNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    profileImageURL?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    assignedIAMPolicies?: AccountUpdateassignedIAMPoliciesInput | string[]
    accountState?: EnumAccountStateFieldUpdateOperationsInput | $Enums.AccountState
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attendees?: AttendeeUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type AccountCreateManyInput = {
    id?: string
    email: string
    password: string
    firstName: string
    lastName: string
    displayName: string
    profileImageURL?: string | null
    role?: $Enums.UserRole
    assignedIAMPolicies?: AccountCreateassignedIAMPoliciesInput | string[]
    accountState?: $Enums.AccountState
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    profileImageURL?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    assignedIAMPolicies?: AccountUpdateassignedIAMPoliciesInput | string[]
    accountState?: EnumAccountStateFieldUpdateOperationsInput | $Enums.AccountState
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    profileImageURL?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    assignedIAMPolicies?: AccountUpdateassignedIAMPoliciesInput | string[]
    accountState?: EnumAccountStateFieldUpdateOperationsInput | $Enums.AccountState
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttendeeCreateInput = {
    id?: string
    enrollmentId: string
    name: string
    course: string
    school: string
    degree: string
    email?: string | null
    phone?: string | null
    convocationEligible?: boolean
    convocationRegistered?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    crr: string
    enclosure: string
    account?: AccountCreateNestedOneWithoutAttendeesInput
    allocation?: SeatAllocationCreateNestedOneWithoutAttendeeInput
  }

  export type AttendeeUncheckedCreateInput = {
    id?: string
    enrollmentId: string
    name: string
    course: string
    school: string
    degree: string
    email?: string | null
    phone?: string | null
    convocationEligible?: boolean
    convocationRegistered?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    crr: string
    enclosure: string
    accountId?: string | null
    allocation?: SeatAllocationUncheckedCreateNestedOneWithoutAttendeeInput
  }

  export type AttendeeUpdateInput = {
    enrollmentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    course?: StringFieldUpdateOperationsInput | string
    school?: StringFieldUpdateOperationsInput | string
    degree?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    convocationEligible?: BoolFieldUpdateOperationsInput | boolean
    convocationRegistered?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    crr?: StringFieldUpdateOperationsInput | string
    enclosure?: StringFieldUpdateOperationsInput | string
    account?: AccountUpdateOneWithoutAttendeesNestedInput
    allocation?: SeatAllocationUpdateOneWithoutAttendeeNestedInput
  }

  export type AttendeeUncheckedUpdateInput = {
    enrollmentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    course?: StringFieldUpdateOperationsInput | string
    school?: StringFieldUpdateOperationsInput | string
    degree?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    convocationEligible?: BoolFieldUpdateOperationsInput | boolean
    convocationRegistered?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    crr?: StringFieldUpdateOperationsInput | string
    enclosure?: StringFieldUpdateOperationsInput | string
    accountId?: NullableStringFieldUpdateOperationsInput | string | null
    allocation?: SeatAllocationUncheckedUpdateOneWithoutAttendeeNestedInput
  }

  export type AttendeeCreateManyInput = {
    id?: string
    enrollmentId: string
    name: string
    course: string
    school: string
    degree: string
    email?: string | null
    phone?: string | null
    convocationEligible?: boolean
    convocationRegistered?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    crr: string
    enclosure: string
    accountId?: string | null
  }

  export type AttendeeUpdateManyMutationInput = {
    enrollmentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    course?: StringFieldUpdateOperationsInput | string
    school?: StringFieldUpdateOperationsInput | string
    degree?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    convocationEligible?: BoolFieldUpdateOperationsInput | boolean
    convocationRegistered?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    crr?: StringFieldUpdateOperationsInput | string
    enclosure?: StringFieldUpdateOperationsInput | string
  }

  export type AttendeeUncheckedUpdateManyInput = {
    enrollmentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    course?: StringFieldUpdateOperationsInput | string
    school?: StringFieldUpdateOperationsInput | string
    degree?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    convocationEligible?: BoolFieldUpdateOperationsInput | boolean
    convocationRegistered?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    crr?: StringFieldUpdateOperationsInput | string
    enclosure?: StringFieldUpdateOperationsInput | string
    accountId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SeatAllocationCreateInput = {
    id?: string
    enclosure: string
    row: string
    seat: number
    allocatedAt?: Date | string
    attendee: AttendeeCreateNestedOneWithoutAllocationInput
  }

  export type SeatAllocationUncheckedCreateInput = {
    id?: string
    enclosure: string
    row: string
    seat: number
    allocatedAt?: Date | string
    attendeeId: string
  }

  export type SeatAllocationUpdateInput = {
    enclosure?: StringFieldUpdateOperationsInput | string
    row?: StringFieldUpdateOperationsInput | string
    seat?: IntFieldUpdateOperationsInput | number
    allocatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attendee?: AttendeeUpdateOneRequiredWithoutAllocationNestedInput
  }

  export type SeatAllocationUncheckedUpdateInput = {
    enclosure?: StringFieldUpdateOperationsInput | string
    row?: StringFieldUpdateOperationsInput | string
    seat?: IntFieldUpdateOperationsInput | number
    allocatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attendeeId?: StringFieldUpdateOperationsInput | string
  }

  export type SeatAllocationCreateManyInput = {
    id?: string
    enclosure: string
    row: string
    seat: number
    allocatedAt?: Date | string
    attendeeId: string
  }

  export type SeatAllocationUpdateManyMutationInput = {
    enclosure?: StringFieldUpdateOperationsInput | string
    row?: StringFieldUpdateOperationsInput | string
    seat?: IntFieldUpdateOperationsInput | number
    allocatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeatAllocationUncheckedUpdateManyInput = {
    enclosure?: StringFieldUpdateOperationsInput | string
    row?: StringFieldUpdateOperationsInput | string
    seat?: IntFieldUpdateOperationsInput | number
    allocatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attendeeId?: StringFieldUpdateOperationsInput | string
  }

  export type EnclosureCreateInput = {
    id?: string
    letter: string
    allocatedFor: $Enums.EnclosureType
    entryDirection: $Enums.Direction
    rows?: RowCreateNestedManyWithoutEnclosureInput
  }

  export type EnclosureUncheckedCreateInput = {
    id?: string
    letter: string
    allocatedFor: $Enums.EnclosureType
    entryDirection: $Enums.Direction
    rows?: RowUncheckedCreateNestedManyWithoutEnclosureInput
  }

  export type EnclosureUpdateInput = {
    letter?: StringFieldUpdateOperationsInput | string
    allocatedFor?: EnumEnclosureTypeFieldUpdateOperationsInput | $Enums.EnclosureType
    entryDirection?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
    rows?: RowUpdateManyWithoutEnclosureNestedInput
  }

  export type EnclosureUncheckedUpdateInput = {
    letter?: StringFieldUpdateOperationsInput | string
    allocatedFor?: EnumEnclosureTypeFieldUpdateOperationsInput | $Enums.EnclosureType
    entryDirection?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
    rows?: RowUncheckedUpdateManyWithoutEnclosureNestedInput
  }

  export type EnclosureCreateManyInput = {
    id?: string
    letter: string
    allocatedFor: $Enums.EnclosureType
    entryDirection: $Enums.Direction
  }

  export type EnclosureUpdateManyMutationInput = {
    letter?: StringFieldUpdateOperationsInput | string
    allocatedFor?: EnumEnclosureTypeFieldUpdateOperationsInput | $Enums.EnclosureType
    entryDirection?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
  }

  export type EnclosureUncheckedUpdateManyInput = {
    letter?: StringFieldUpdateOperationsInput | string
    allocatedFor?: EnumEnclosureTypeFieldUpdateOperationsInput | $Enums.EnclosureType
    entryDirection?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
  }

  export type RowCreateInput = {
    id?: string
    letter: string
    startSeat: number
    endSeat: number
    reserved?: string
    enclosure: EnclosureCreateNestedOneWithoutRowsInput
  }

  export type RowUncheckedCreateInput = {
    id?: string
    letter: string
    startSeat: number
    endSeat: number
    reserved?: string
    enclosureId: string
  }

  export type RowUpdateInput = {
    letter?: StringFieldUpdateOperationsInput | string
    startSeat?: IntFieldUpdateOperationsInput | number
    endSeat?: IntFieldUpdateOperationsInput | number
    reserved?: StringFieldUpdateOperationsInput | string
    enclosure?: EnclosureUpdateOneRequiredWithoutRowsNestedInput
  }

  export type RowUncheckedUpdateInput = {
    letter?: StringFieldUpdateOperationsInput | string
    startSeat?: IntFieldUpdateOperationsInput | number
    endSeat?: IntFieldUpdateOperationsInput | number
    reserved?: StringFieldUpdateOperationsInput | string
    enclosureId?: StringFieldUpdateOperationsInput | string
  }

  export type RowCreateManyInput = {
    id?: string
    letter: string
    startSeat: number
    endSeat: number
    reserved?: string
    enclosureId: string
  }

  export type RowUpdateManyMutationInput = {
    letter?: StringFieldUpdateOperationsInput | string
    startSeat?: IntFieldUpdateOperationsInput | number
    endSeat?: IntFieldUpdateOperationsInput | number
    reserved?: StringFieldUpdateOperationsInput | string
  }

  export type RowUncheckedUpdateManyInput = {
    letter?: StringFieldUpdateOperationsInput | string
    startSeat?: IntFieldUpdateOperationsInput | number
    endSeat?: IntFieldUpdateOperationsInput | number
    reserved?: StringFieldUpdateOperationsInput | string
    enclosureId?: StringFieldUpdateOperationsInput | string
  }

  export type AnalyticsCreateInput = {
    id?: string
    date: Date | string
    visitors?: number
    pageViews?: number
    uniqueVisitors?: number
    countries?: InputJsonValue
    languages?: InputJsonValue
    devices?: InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnalyticsUncheckedCreateInput = {
    id?: string
    date: Date | string
    visitors?: number
    pageViews?: number
    uniqueVisitors?: number
    countries?: InputJsonValue
    languages?: InputJsonValue
    devices?: InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnalyticsUpdateInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    visitors?: IntFieldUpdateOperationsInput | number
    pageViews?: IntFieldUpdateOperationsInput | number
    uniqueVisitors?: IntFieldUpdateOperationsInput | number
    countries?: InputJsonValue | InputJsonValue
    languages?: InputJsonValue | InputJsonValue
    devices?: InputJsonValue | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalyticsUncheckedUpdateInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    visitors?: IntFieldUpdateOperationsInput | number
    pageViews?: IntFieldUpdateOperationsInput | number
    uniqueVisitors?: IntFieldUpdateOperationsInput | number
    countries?: InputJsonValue | InputJsonValue
    languages?: InputJsonValue | InputJsonValue
    devices?: InputJsonValue | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalyticsCreateManyInput = {
    id?: string
    date: Date | string
    visitors?: number
    pageViews?: number
    uniqueVisitors?: number
    countries?: InputJsonValue
    languages?: InputJsonValue
    devices?: InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnalyticsUpdateManyMutationInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    visitors?: IntFieldUpdateOperationsInput | number
    pageViews?: IntFieldUpdateOperationsInput | number
    uniqueVisitors?: IntFieldUpdateOperationsInput | number
    countries?: InputJsonValue | InputJsonValue
    languages?: InputJsonValue | InputJsonValue
    devices?: InputJsonValue | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalyticsUncheckedUpdateManyInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    visitors?: IntFieldUpdateOperationsInput | number
    pageViews?: IntFieldUpdateOperationsInput | number
    uniqueVisitors?: IntFieldUpdateOperationsInput | number
    countries?: InputJsonValue | InputJsonValue
    languages?: InputJsonValue | InputJsonValue
    devices?: InputJsonValue | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IAMPolicyCreateInput = {
    id?: string
    name: string
    description: string
    permissions?: IAMPolicyCreatepermissionsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IAMPolicyUncheckedCreateInput = {
    id?: string
    name: string
    description: string
    permissions?: IAMPolicyCreatepermissionsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IAMPolicyUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    permissions?: IAMPolicyUpdatepermissionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IAMPolicyUncheckedUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    permissions?: IAMPolicyUpdatepermissionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IAMPolicyCreateManyInput = {
    id?: string
    name: string
    description: string
    permissions?: IAMPolicyCreatepermissionsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IAMPolicyUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    permissions?: IAMPolicyUpdatepermissionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IAMPolicyUncheckedUpdateManyInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    permissions?: IAMPolicyUpdatepermissionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentCreateInput = {
    id?: string
    name: string
    code: string
    school: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DepartmentUncheckedCreateInput = {
    id?: string
    name: string
    code: string
    school: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DepartmentUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    school?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentUncheckedUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    school?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentCreateManyInput = {
    id?: string
    name: string
    code: string
    school: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DepartmentUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    school?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentUncheckedUpdateManyInput = {
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    school?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConvocationCreateInput = {
    id?: string
    title: string
    description?: string | null
    eventDate: Date | string
    registrationStartDate: Date | string
    registrationEndDate: Date | string
    venue: string
    isActive?: boolean
    maxAttendees?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConvocationUncheckedCreateInput = {
    id?: string
    title: string
    description?: string | null
    eventDate: Date | string
    registrationStartDate: Date | string
    registrationEndDate: Date | string
    venue: string
    isActive?: boolean
    maxAttendees?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConvocationUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationEndDate?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    maxAttendees?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConvocationUncheckedUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationEndDate?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    maxAttendees?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConvocationCreateManyInput = {
    id?: string
    title: string
    description?: string | null
    eventDate: Date | string
    registrationStartDate: Date | string
    registrationEndDate: Date | string
    venue: string
    isActive?: boolean
    maxAttendees?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConvocationUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationEndDate?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    maxAttendees?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConvocationUncheckedUpdateManyInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationEndDate?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    maxAttendees?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
    isSet?: boolean
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumAccountStateFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountState | EnumAccountStateFieldRefInput<$PrismaModel>
    in?: $Enums.AccountState[] | ListEnumAccountStateFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountState[] | ListEnumAccountStateFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountStateFilter<$PrismaModel> | $Enums.AccountState
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
    isSet?: boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AttendeeListRelationFilter = {
    every?: AttendeeWhereInput
    some?: AttendeeWhereInput
    none?: AttendeeWhereInput
  }

  export type AttendeeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    displayName?: SortOrder
    profileImageURL?: SortOrder
    role?: SortOrder
    assignedIAMPolicies?: SortOrder
    accountState?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    displayName?: SortOrder
    profileImageURL?: SortOrder
    role?: SortOrder
    accountState?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    displayName?: SortOrder
    profileImageURL?: SortOrder
    role?: SortOrder
    accountState?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type EnumAccountStateWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountState | EnumAccountStateFieldRefInput<$PrismaModel>
    in?: $Enums.AccountState[] | ListEnumAccountStateFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountState[] | ListEnumAccountStateFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountStateWithAggregatesFilter<$PrismaModel> | $Enums.AccountState
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAccountStateFilter<$PrismaModel>
    _max?: NestedEnumAccountStateFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type AccountNullableScalarRelationFilter = {
    is?: AccountWhereInput | null
    isNot?: AccountWhereInput | null
  }

  export type SeatAllocationNullableScalarRelationFilter = {
    is?: SeatAllocationWhereInput | null
    isNot?: SeatAllocationWhereInput | null
  }

  export type AttendeeCountOrderByAggregateInput = {
    id?: SortOrder
    enrollmentId?: SortOrder
    name?: SortOrder
    course?: SortOrder
    school?: SortOrder
    degree?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    convocationEligible?: SortOrder
    convocationRegistered?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    crr?: SortOrder
    enclosure?: SortOrder
    accountId?: SortOrder
  }

  export type AttendeeMaxOrderByAggregateInput = {
    id?: SortOrder
    enrollmentId?: SortOrder
    name?: SortOrder
    course?: SortOrder
    school?: SortOrder
    degree?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    convocationEligible?: SortOrder
    convocationRegistered?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    crr?: SortOrder
    enclosure?: SortOrder
    accountId?: SortOrder
  }

  export type AttendeeMinOrderByAggregateInput = {
    id?: SortOrder
    enrollmentId?: SortOrder
    name?: SortOrder
    course?: SortOrder
    school?: SortOrder
    degree?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    convocationEligible?: SortOrder
    convocationRegistered?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    crr?: SortOrder
    enclosure?: SortOrder
    accountId?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type AttendeeScalarRelationFilter = {
    is?: AttendeeWhereInput
    isNot?: AttendeeWhereInput
  }

  export type SeatAllocationCountOrderByAggregateInput = {
    id?: SortOrder
    enclosure?: SortOrder
    row?: SortOrder
    seat?: SortOrder
    allocatedAt?: SortOrder
    attendeeId?: SortOrder
  }

  export type SeatAllocationAvgOrderByAggregateInput = {
    seat?: SortOrder
  }

  export type SeatAllocationMaxOrderByAggregateInput = {
    id?: SortOrder
    enclosure?: SortOrder
    row?: SortOrder
    seat?: SortOrder
    allocatedAt?: SortOrder
    attendeeId?: SortOrder
  }

  export type SeatAllocationMinOrderByAggregateInput = {
    id?: SortOrder
    enclosure?: SortOrder
    row?: SortOrder
    seat?: SortOrder
    allocatedAt?: SortOrder
    attendeeId?: SortOrder
  }

  export type SeatAllocationSumOrderByAggregateInput = {
    seat?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumEnclosureTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.EnclosureType | EnumEnclosureTypeFieldRefInput<$PrismaModel>
    in?: $Enums.EnclosureType[] | ListEnumEnclosureTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.EnclosureType[] | ListEnumEnclosureTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumEnclosureTypeFilter<$PrismaModel> | $Enums.EnclosureType
  }

  export type EnumDirectionFilter<$PrismaModel = never> = {
    equals?: $Enums.Direction | EnumDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.Direction[] | ListEnumDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.Direction[] | ListEnumDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumDirectionFilter<$PrismaModel> | $Enums.Direction
  }

  export type RowListRelationFilter = {
    every?: RowWhereInput
    some?: RowWhereInput
    none?: RowWhereInput
  }

  export type RowOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EnclosureCountOrderByAggregateInput = {
    id?: SortOrder
    letter?: SortOrder
    allocatedFor?: SortOrder
    entryDirection?: SortOrder
  }

  export type EnclosureMaxOrderByAggregateInput = {
    id?: SortOrder
    letter?: SortOrder
    allocatedFor?: SortOrder
    entryDirection?: SortOrder
  }

  export type EnclosureMinOrderByAggregateInput = {
    id?: SortOrder
    letter?: SortOrder
    allocatedFor?: SortOrder
    entryDirection?: SortOrder
  }

  export type EnumEnclosureTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EnclosureType | EnumEnclosureTypeFieldRefInput<$PrismaModel>
    in?: $Enums.EnclosureType[] | ListEnumEnclosureTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.EnclosureType[] | ListEnumEnclosureTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumEnclosureTypeWithAggregatesFilter<$PrismaModel> | $Enums.EnclosureType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEnclosureTypeFilter<$PrismaModel>
    _max?: NestedEnumEnclosureTypeFilter<$PrismaModel>
  }

  export type EnumDirectionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Direction | EnumDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.Direction[] | ListEnumDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.Direction[] | ListEnumDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumDirectionWithAggregatesFilter<$PrismaModel> | $Enums.Direction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDirectionFilter<$PrismaModel>
    _max?: NestedEnumDirectionFilter<$PrismaModel>
  }

  export type EnclosureScalarRelationFilter = {
    is?: EnclosureWhereInput
    isNot?: EnclosureWhereInput
  }

  export type RowCountOrderByAggregateInput = {
    id?: SortOrder
    letter?: SortOrder
    startSeat?: SortOrder
    endSeat?: SortOrder
    reserved?: SortOrder
    enclosureId?: SortOrder
  }

  export type RowAvgOrderByAggregateInput = {
    startSeat?: SortOrder
    endSeat?: SortOrder
  }

  export type RowMaxOrderByAggregateInput = {
    id?: SortOrder
    letter?: SortOrder
    startSeat?: SortOrder
    endSeat?: SortOrder
    reserved?: SortOrder
    enclosureId?: SortOrder
  }

  export type RowMinOrderByAggregateInput = {
    id?: SortOrder
    letter?: SortOrder
    startSeat?: SortOrder
    endSeat?: SortOrder
    reserved?: SortOrder
    enclosureId?: SortOrder
  }

  export type RowSumOrderByAggregateInput = {
    startSeat?: SortOrder
    endSeat?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
  }

  export type AnalyticsCountOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    visitors?: SortOrder
    pageViews?: SortOrder
    uniqueVisitors?: SortOrder
    countries?: SortOrder
    languages?: SortOrder
    devices?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AnalyticsAvgOrderByAggregateInput = {
    visitors?: SortOrder
    pageViews?: SortOrder
    uniqueVisitors?: SortOrder
  }

  export type AnalyticsMaxOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    visitors?: SortOrder
    pageViews?: SortOrder
    uniqueVisitors?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AnalyticsMinOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    visitors?: SortOrder
    pageViews?: SortOrder
    uniqueVisitors?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AnalyticsSumOrderByAggregateInput = {
    visitors?: SortOrder
    pageViews?: SortOrder
    uniqueVisitors?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type IAMPolicyCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    permissions?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IAMPolicyMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IAMPolicyMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DepartmentCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    school?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DepartmentMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    school?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DepartmentMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    school?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }

  export type ConvocationCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    eventDate?: SortOrder
    registrationStartDate?: SortOrder
    registrationEndDate?: SortOrder
    venue?: SortOrder
    isActive?: SortOrder
    maxAttendees?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConvocationAvgOrderByAggregateInput = {
    maxAttendees?: SortOrder
  }

  export type ConvocationMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    eventDate?: SortOrder
    registrationStartDate?: SortOrder
    registrationEndDate?: SortOrder
    venue?: SortOrder
    isActive?: SortOrder
    maxAttendees?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConvocationMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    eventDate?: SortOrder
    registrationStartDate?: SortOrder
    registrationEndDate?: SortOrder
    venue?: SortOrder
    isActive?: SortOrder
    maxAttendees?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConvocationSumOrderByAggregateInput = {
    maxAttendees?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type AccountCreateassignedIAMPoliciesInput = {
    set: string[]
  }

  export type AttendeeCreateNestedManyWithoutAccountInput = {
    create?: XOR<AttendeeCreateWithoutAccountInput, AttendeeUncheckedCreateWithoutAccountInput> | AttendeeCreateWithoutAccountInput[] | AttendeeUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: AttendeeCreateOrConnectWithoutAccountInput | AttendeeCreateOrConnectWithoutAccountInput[]
    createMany?: AttendeeCreateManyAccountInputEnvelope
    connect?: AttendeeWhereUniqueInput | AttendeeWhereUniqueInput[]
  }

  export type AttendeeUncheckedCreateNestedManyWithoutAccountInput = {
    create?: XOR<AttendeeCreateWithoutAccountInput, AttendeeUncheckedCreateWithoutAccountInput> | AttendeeCreateWithoutAccountInput[] | AttendeeUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: AttendeeCreateOrConnectWithoutAccountInput | AttendeeCreateOrConnectWithoutAccountInput[]
    createMany?: AttendeeCreateManyAccountInputEnvelope
    connect?: AttendeeWhereUniqueInput | AttendeeWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
    unset?: boolean
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type AccountUpdateassignedIAMPoliciesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnumAccountStateFieldUpdateOperationsInput = {
    set?: $Enums.AccountState
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
    unset?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AttendeeUpdateManyWithoutAccountNestedInput = {
    create?: XOR<AttendeeCreateWithoutAccountInput, AttendeeUncheckedCreateWithoutAccountInput> | AttendeeCreateWithoutAccountInput[] | AttendeeUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: AttendeeCreateOrConnectWithoutAccountInput | AttendeeCreateOrConnectWithoutAccountInput[]
    upsert?: AttendeeUpsertWithWhereUniqueWithoutAccountInput | AttendeeUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: AttendeeCreateManyAccountInputEnvelope
    set?: AttendeeWhereUniqueInput | AttendeeWhereUniqueInput[]
    disconnect?: AttendeeWhereUniqueInput | AttendeeWhereUniqueInput[]
    delete?: AttendeeWhereUniqueInput | AttendeeWhereUniqueInput[]
    connect?: AttendeeWhereUniqueInput | AttendeeWhereUniqueInput[]
    update?: AttendeeUpdateWithWhereUniqueWithoutAccountInput | AttendeeUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: AttendeeUpdateManyWithWhereWithoutAccountInput | AttendeeUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: AttendeeScalarWhereInput | AttendeeScalarWhereInput[]
  }

  export type AttendeeUncheckedUpdateManyWithoutAccountNestedInput = {
    create?: XOR<AttendeeCreateWithoutAccountInput, AttendeeUncheckedCreateWithoutAccountInput> | AttendeeCreateWithoutAccountInput[] | AttendeeUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: AttendeeCreateOrConnectWithoutAccountInput | AttendeeCreateOrConnectWithoutAccountInput[]
    upsert?: AttendeeUpsertWithWhereUniqueWithoutAccountInput | AttendeeUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: AttendeeCreateManyAccountInputEnvelope
    set?: AttendeeWhereUniqueInput | AttendeeWhereUniqueInput[]
    disconnect?: AttendeeWhereUniqueInput | AttendeeWhereUniqueInput[]
    delete?: AttendeeWhereUniqueInput | AttendeeWhereUniqueInput[]
    connect?: AttendeeWhereUniqueInput | AttendeeWhereUniqueInput[]
    update?: AttendeeUpdateWithWhereUniqueWithoutAccountInput | AttendeeUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: AttendeeUpdateManyWithWhereWithoutAccountInput | AttendeeUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: AttendeeScalarWhereInput | AttendeeScalarWhereInput[]
  }

  export type AccountCreateNestedOneWithoutAttendeesInput = {
    create?: XOR<AccountCreateWithoutAttendeesInput, AccountUncheckedCreateWithoutAttendeesInput>
    connectOrCreate?: AccountCreateOrConnectWithoutAttendeesInput
    connect?: AccountWhereUniqueInput
  }

  export type SeatAllocationCreateNestedOneWithoutAttendeeInput = {
    create?: XOR<SeatAllocationCreateWithoutAttendeeInput, SeatAllocationUncheckedCreateWithoutAttendeeInput>
    connectOrCreate?: SeatAllocationCreateOrConnectWithoutAttendeeInput
    connect?: SeatAllocationWhereUniqueInput
  }

  export type SeatAllocationUncheckedCreateNestedOneWithoutAttendeeInput = {
    create?: XOR<SeatAllocationCreateWithoutAttendeeInput, SeatAllocationUncheckedCreateWithoutAttendeeInput>
    connectOrCreate?: SeatAllocationCreateOrConnectWithoutAttendeeInput
    connect?: SeatAllocationWhereUniqueInput
  }

  export type AccountUpdateOneWithoutAttendeesNestedInput = {
    create?: XOR<AccountCreateWithoutAttendeesInput, AccountUncheckedCreateWithoutAttendeesInput>
    connectOrCreate?: AccountCreateOrConnectWithoutAttendeesInput
    upsert?: AccountUpsertWithoutAttendeesInput
    disconnect?: boolean
    delete?: AccountWhereInput | boolean
    connect?: AccountWhereUniqueInput
    update?: XOR<XOR<AccountUpdateToOneWithWhereWithoutAttendeesInput, AccountUpdateWithoutAttendeesInput>, AccountUncheckedUpdateWithoutAttendeesInput>
  }

  export type SeatAllocationUpdateOneWithoutAttendeeNestedInput = {
    create?: XOR<SeatAllocationCreateWithoutAttendeeInput, SeatAllocationUncheckedCreateWithoutAttendeeInput>
    connectOrCreate?: SeatAllocationCreateOrConnectWithoutAttendeeInput
    upsert?: SeatAllocationUpsertWithoutAttendeeInput
    disconnect?: SeatAllocationWhereInput | boolean
    delete?: SeatAllocationWhereInput | boolean
    connect?: SeatAllocationWhereUniqueInput
    update?: XOR<XOR<SeatAllocationUpdateToOneWithWhereWithoutAttendeeInput, SeatAllocationUpdateWithoutAttendeeInput>, SeatAllocationUncheckedUpdateWithoutAttendeeInput>
  }

  export type SeatAllocationUncheckedUpdateOneWithoutAttendeeNestedInput = {
    create?: XOR<SeatAllocationCreateWithoutAttendeeInput, SeatAllocationUncheckedCreateWithoutAttendeeInput>
    connectOrCreate?: SeatAllocationCreateOrConnectWithoutAttendeeInput
    upsert?: SeatAllocationUpsertWithoutAttendeeInput
    disconnect?: SeatAllocationWhereInput | boolean
    delete?: SeatAllocationWhereInput | boolean
    connect?: SeatAllocationWhereUniqueInput
    update?: XOR<XOR<SeatAllocationUpdateToOneWithWhereWithoutAttendeeInput, SeatAllocationUpdateWithoutAttendeeInput>, SeatAllocationUncheckedUpdateWithoutAttendeeInput>
  }

  export type AttendeeCreateNestedOneWithoutAllocationInput = {
    create?: XOR<AttendeeCreateWithoutAllocationInput, AttendeeUncheckedCreateWithoutAllocationInput>
    connectOrCreate?: AttendeeCreateOrConnectWithoutAllocationInput
    connect?: AttendeeWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AttendeeUpdateOneRequiredWithoutAllocationNestedInput = {
    create?: XOR<AttendeeCreateWithoutAllocationInput, AttendeeUncheckedCreateWithoutAllocationInput>
    connectOrCreate?: AttendeeCreateOrConnectWithoutAllocationInput
    upsert?: AttendeeUpsertWithoutAllocationInput
    connect?: AttendeeWhereUniqueInput
    update?: XOR<XOR<AttendeeUpdateToOneWithWhereWithoutAllocationInput, AttendeeUpdateWithoutAllocationInput>, AttendeeUncheckedUpdateWithoutAllocationInput>
  }

  export type RowCreateNestedManyWithoutEnclosureInput = {
    create?: XOR<RowCreateWithoutEnclosureInput, RowUncheckedCreateWithoutEnclosureInput> | RowCreateWithoutEnclosureInput[] | RowUncheckedCreateWithoutEnclosureInput[]
    connectOrCreate?: RowCreateOrConnectWithoutEnclosureInput | RowCreateOrConnectWithoutEnclosureInput[]
    createMany?: RowCreateManyEnclosureInputEnvelope
    connect?: RowWhereUniqueInput | RowWhereUniqueInput[]
  }

  export type RowUncheckedCreateNestedManyWithoutEnclosureInput = {
    create?: XOR<RowCreateWithoutEnclosureInput, RowUncheckedCreateWithoutEnclosureInput> | RowCreateWithoutEnclosureInput[] | RowUncheckedCreateWithoutEnclosureInput[]
    connectOrCreate?: RowCreateOrConnectWithoutEnclosureInput | RowCreateOrConnectWithoutEnclosureInput[]
    createMany?: RowCreateManyEnclosureInputEnvelope
    connect?: RowWhereUniqueInput | RowWhereUniqueInput[]
  }

  export type EnumEnclosureTypeFieldUpdateOperationsInput = {
    set?: $Enums.EnclosureType
  }

  export type EnumDirectionFieldUpdateOperationsInput = {
    set?: $Enums.Direction
  }

  export type RowUpdateManyWithoutEnclosureNestedInput = {
    create?: XOR<RowCreateWithoutEnclosureInput, RowUncheckedCreateWithoutEnclosureInput> | RowCreateWithoutEnclosureInput[] | RowUncheckedCreateWithoutEnclosureInput[]
    connectOrCreate?: RowCreateOrConnectWithoutEnclosureInput | RowCreateOrConnectWithoutEnclosureInput[]
    upsert?: RowUpsertWithWhereUniqueWithoutEnclosureInput | RowUpsertWithWhereUniqueWithoutEnclosureInput[]
    createMany?: RowCreateManyEnclosureInputEnvelope
    set?: RowWhereUniqueInput | RowWhereUniqueInput[]
    disconnect?: RowWhereUniqueInput | RowWhereUniqueInput[]
    delete?: RowWhereUniqueInput | RowWhereUniqueInput[]
    connect?: RowWhereUniqueInput | RowWhereUniqueInput[]
    update?: RowUpdateWithWhereUniqueWithoutEnclosureInput | RowUpdateWithWhereUniqueWithoutEnclosureInput[]
    updateMany?: RowUpdateManyWithWhereWithoutEnclosureInput | RowUpdateManyWithWhereWithoutEnclosureInput[]
    deleteMany?: RowScalarWhereInput | RowScalarWhereInput[]
  }

  export type RowUncheckedUpdateManyWithoutEnclosureNestedInput = {
    create?: XOR<RowCreateWithoutEnclosureInput, RowUncheckedCreateWithoutEnclosureInput> | RowCreateWithoutEnclosureInput[] | RowUncheckedCreateWithoutEnclosureInput[]
    connectOrCreate?: RowCreateOrConnectWithoutEnclosureInput | RowCreateOrConnectWithoutEnclosureInput[]
    upsert?: RowUpsertWithWhereUniqueWithoutEnclosureInput | RowUpsertWithWhereUniqueWithoutEnclosureInput[]
    createMany?: RowCreateManyEnclosureInputEnvelope
    set?: RowWhereUniqueInput | RowWhereUniqueInput[]
    disconnect?: RowWhereUniqueInput | RowWhereUniqueInput[]
    delete?: RowWhereUniqueInput | RowWhereUniqueInput[]
    connect?: RowWhereUniqueInput | RowWhereUniqueInput[]
    update?: RowUpdateWithWhereUniqueWithoutEnclosureInput | RowUpdateWithWhereUniqueWithoutEnclosureInput[]
    updateMany?: RowUpdateManyWithWhereWithoutEnclosureInput | RowUpdateManyWithWhereWithoutEnclosureInput[]
    deleteMany?: RowScalarWhereInput | RowScalarWhereInput[]
  }

  export type EnclosureCreateNestedOneWithoutRowsInput = {
    create?: XOR<EnclosureCreateWithoutRowsInput, EnclosureUncheckedCreateWithoutRowsInput>
    connectOrCreate?: EnclosureCreateOrConnectWithoutRowsInput
    connect?: EnclosureWhereUniqueInput
  }

  export type EnclosureUpdateOneRequiredWithoutRowsNestedInput = {
    create?: XOR<EnclosureCreateWithoutRowsInput, EnclosureUncheckedCreateWithoutRowsInput>
    connectOrCreate?: EnclosureCreateOrConnectWithoutRowsInput
    upsert?: EnclosureUpsertWithoutRowsInput
    connect?: EnclosureWhereUniqueInput
    update?: XOR<XOR<EnclosureUpdateToOneWithWhereWithoutRowsInput, EnclosureUpdateWithoutRowsInput>, EnclosureUncheckedUpdateWithoutRowsInput>
  }

  export type IAMPolicyCreatepermissionsInput = {
    set: string[]
  }

  export type IAMPolicyUpdatepermissionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
    unset?: boolean
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
    isSet?: boolean
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedEnumAccountStateFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountState | EnumAccountStateFieldRefInput<$PrismaModel>
    in?: $Enums.AccountState[] | ListEnumAccountStateFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountState[] | ListEnumAccountStateFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountStateFilter<$PrismaModel> | $Enums.AccountState
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
    isSet?: boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedEnumAccountStateWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountState | EnumAccountStateFieldRefInput<$PrismaModel>
    in?: $Enums.AccountState[] | ListEnumAccountStateFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountState[] | ListEnumAccountStateFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountStateWithAggregatesFilter<$PrismaModel> | $Enums.AccountState
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAccountStateFilter<$PrismaModel>
    _max?: NestedEnumAccountStateFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumEnclosureTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.EnclosureType | EnumEnclosureTypeFieldRefInput<$PrismaModel>
    in?: $Enums.EnclosureType[] | ListEnumEnclosureTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.EnclosureType[] | ListEnumEnclosureTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumEnclosureTypeFilter<$PrismaModel> | $Enums.EnclosureType
  }

  export type NestedEnumDirectionFilter<$PrismaModel = never> = {
    equals?: $Enums.Direction | EnumDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.Direction[] | ListEnumDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.Direction[] | ListEnumDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumDirectionFilter<$PrismaModel> | $Enums.Direction
  }

  export type NestedEnumEnclosureTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EnclosureType | EnumEnclosureTypeFieldRefInput<$PrismaModel>
    in?: $Enums.EnclosureType[] | ListEnumEnclosureTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.EnclosureType[] | ListEnumEnclosureTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumEnclosureTypeWithAggregatesFilter<$PrismaModel> | $Enums.EnclosureType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEnclosureTypeFilter<$PrismaModel>
    _max?: NestedEnumEnclosureTypeFilter<$PrismaModel>
  }

  export type NestedEnumDirectionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Direction | EnumDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.Direction[] | ListEnumDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.Direction[] | ListEnumDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumDirectionWithAggregatesFilter<$PrismaModel> | $Enums.Direction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDirectionFilter<$PrismaModel>
    _max?: NestedEnumDirectionFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }

  export type AttendeeCreateWithoutAccountInput = {
    id?: string
    enrollmentId: string
    name: string
    course: string
    school: string
    degree: string
    email?: string | null
    phone?: string | null
    convocationEligible?: boolean
    convocationRegistered?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    crr: string
    enclosure: string
    allocation?: SeatAllocationCreateNestedOneWithoutAttendeeInput
  }

  export type AttendeeUncheckedCreateWithoutAccountInput = {
    id?: string
    enrollmentId: string
    name: string
    course: string
    school: string
    degree: string
    email?: string | null
    phone?: string | null
    convocationEligible?: boolean
    convocationRegistered?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    crr: string
    enclosure: string
    allocation?: SeatAllocationUncheckedCreateNestedOneWithoutAttendeeInput
  }

  export type AttendeeCreateOrConnectWithoutAccountInput = {
    where: AttendeeWhereUniqueInput
    create: XOR<AttendeeCreateWithoutAccountInput, AttendeeUncheckedCreateWithoutAccountInput>
  }

  export type AttendeeCreateManyAccountInputEnvelope = {
    data: AttendeeCreateManyAccountInput | AttendeeCreateManyAccountInput[]
  }

  export type AttendeeUpsertWithWhereUniqueWithoutAccountInput = {
    where: AttendeeWhereUniqueInput
    update: XOR<AttendeeUpdateWithoutAccountInput, AttendeeUncheckedUpdateWithoutAccountInput>
    create: XOR<AttendeeCreateWithoutAccountInput, AttendeeUncheckedCreateWithoutAccountInput>
  }

  export type AttendeeUpdateWithWhereUniqueWithoutAccountInput = {
    where: AttendeeWhereUniqueInput
    data: XOR<AttendeeUpdateWithoutAccountInput, AttendeeUncheckedUpdateWithoutAccountInput>
  }

  export type AttendeeUpdateManyWithWhereWithoutAccountInput = {
    where: AttendeeScalarWhereInput
    data: XOR<AttendeeUpdateManyMutationInput, AttendeeUncheckedUpdateManyWithoutAccountInput>
  }

  export type AttendeeScalarWhereInput = {
    AND?: AttendeeScalarWhereInput | AttendeeScalarWhereInput[]
    OR?: AttendeeScalarWhereInput[]
    NOT?: AttendeeScalarWhereInput | AttendeeScalarWhereInput[]
    id?: StringFilter<"Attendee"> | string
    enrollmentId?: StringFilter<"Attendee"> | string
    name?: StringFilter<"Attendee"> | string
    course?: StringFilter<"Attendee"> | string
    school?: StringFilter<"Attendee"> | string
    degree?: StringFilter<"Attendee"> | string
    email?: StringNullableFilter<"Attendee"> | string | null
    phone?: StringNullableFilter<"Attendee"> | string | null
    convocationEligible?: BoolFilter<"Attendee"> | boolean
    convocationRegistered?: BoolFilter<"Attendee"> | boolean
    createdAt?: DateTimeFilter<"Attendee"> | Date | string
    updatedAt?: DateTimeFilter<"Attendee"> | Date | string
    crr?: StringFilter<"Attendee"> | string
    enclosure?: StringFilter<"Attendee"> | string
    accountId?: StringNullableFilter<"Attendee"> | string | null
  }

  export type AccountCreateWithoutAttendeesInput = {
    id?: string
    email: string
    password: string
    firstName: string
    lastName: string
    displayName: string
    profileImageURL?: string | null
    role?: $Enums.UserRole
    assignedIAMPolicies?: AccountCreateassignedIAMPoliciesInput | string[]
    accountState?: $Enums.AccountState
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUncheckedCreateWithoutAttendeesInput = {
    id?: string
    email: string
    password: string
    firstName: string
    lastName: string
    displayName: string
    profileImageURL?: string | null
    role?: $Enums.UserRole
    assignedIAMPolicies?: AccountCreateassignedIAMPoliciesInput | string[]
    accountState?: $Enums.AccountState
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountCreateOrConnectWithoutAttendeesInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutAttendeesInput, AccountUncheckedCreateWithoutAttendeesInput>
  }

  export type SeatAllocationCreateWithoutAttendeeInput = {
    id?: string
    enclosure: string
    row: string
    seat: number
    allocatedAt?: Date | string
  }

  export type SeatAllocationUncheckedCreateWithoutAttendeeInput = {
    id?: string
    enclosure: string
    row: string
    seat: number
    allocatedAt?: Date | string
  }

  export type SeatAllocationCreateOrConnectWithoutAttendeeInput = {
    where: SeatAllocationWhereUniqueInput
    create: XOR<SeatAllocationCreateWithoutAttendeeInput, SeatAllocationUncheckedCreateWithoutAttendeeInput>
  }

  export type AccountUpsertWithoutAttendeesInput = {
    update: XOR<AccountUpdateWithoutAttendeesInput, AccountUncheckedUpdateWithoutAttendeesInput>
    create: XOR<AccountCreateWithoutAttendeesInput, AccountUncheckedCreateWithoutAttendeesInput>
    where?: AccountWhereInput
  }

  export type AccountUpdateToOneWithWhereWithoutAttendeesInput = {
    where?: AccountWhereInput
    data: XOR<AccountUpdateWithoutAttendeesInput, AccountUncheckedUpdateWithoutAttendeesInput>
  }

  export type AccountUpdateWithoutAttendeesInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    profileImageURL?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    assignedIAMPolicies?: AccountUpdateassignedIAMPoliciesInput | string[]
    accountState?: EnumAccountStateFieldUpdateOperationsInput | $Enums.AccountState
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateWithoutAttendeesInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    profileImageURL?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    assignedIAMPolicies?: AccountUpdateassignedIAMPoliciesInput | string[]
    accountState?: EnumAccountStateFieldUpdateOperationsInput | $Enums.AccountState
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeatAllocationUpsertWithoutAttendeeInput = {
    update: XOR<SeatAllocationUpdateWithoutAttendeeInput, SeatAllocationUncheckedUpdateWithoutAttendeeInput>
    create: XOR<SeatAllocationCreateWithoutAttendeeInput, SeatAllocationUncheckedCreateWithoutAttendeeInput>
    where?: SeatAllocationWhereInput
  }

  export type SeatAllocationUpdateToOneWithWhereWithoutAttendeeInput = {
    where?: SeatAllocationWhereInput
    data: XOR<SeatAllocationUpdateWithoutAttendeeInput, SeatAllocationUncheckedUpdateWithoutAttendeeInput>
  }

  export type SeatAllocationUpdateWithoutAttendeeInput = {
    enclosure?: StringFieldUpdateOperationsInput | string
    row?: StringFieldUpdateOperationsInput | string
    seat?: IntFieldUpdateOperationsInput | number
    allocatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeatAllocationUncheckedUpdateWithoutAttendeeInput = {
    enclosure?: StringFieldUpdateOperationsInput | string
    row?: StringFieldUpdateOperationsInput | string
    seat?: IntFieldUpdateOperationsInput | number
    allocatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttendeeCreateWithoutAllocationInput = {
    id?: string
    enrollmentId: string
    name: string
    course: string
    school: string
    degree: string
    email?: string | null
    phone?: string | null
    convocationEligible?: boolean
    convocationRegistered?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    crr: string
    enclosure: string
    account?: AccountCreateNestedOneWithoutAttendeesInput
  }

  export type AttendeeUncheckedCreateWithoutAllocationInput = {
    id?: string
    enrollmentId: string
    name: string
    course: string
    school: string
    degree: string
    email?: string | null
    phone?: string | null
    convocationEligible?: boolean
    convocationRegistered?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    crr: string
    enclosure: string
    accountId?: string | null
  }

  export type AttendeeCreateOrConnectWithoutAllocationInput = {
    where: AttendeeWhereUniqueInput
    create: XOR<AttendeeCreateWithoutAllocationInput, AttendeeUncheckedCreateWithoutAllocationInput>
  }

  export type AttendeeUpsertWithoutAllocationInput = {
    update: XOR<AttendeeUpdateWithoutAllocationInput, AttendeeUncheckedUpdateWithoutAllocationInput>
    create: XOR<AttendeeCreateWithoutAllocationInput, AttendeeUncheckedCreateWithoutAllocationInput>
    where?: AttendeeWhereInput
  }

  export type AttendeeUpdateToOneWithWhereWithoutAllocationInput = {
    where?: AttendeeWhereInput
    data: XOR<AttendeeUpdateWithoutAllocationInput, AttendeeUncheckedUpdateWithoutAllocationInput>
  }

  export type AttendeeUpdateWithoutAllocationInput = {
    enrollmentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    course?: StringFieldUpdateOperationsInput | string
    school?: StringFieldUpdateOperationsInput | string
    degree?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    convocationEligible?: BoolFieldUpdateOperationsInput | boolean
    convocationRegistered?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    crr?: StringFieldUpdateOperationsInput | string
    enclosure?: StringFieldUpdateOperationsInput | string
    account?: AccountUpdateOneWithoutAttendeesNestedInput
  }

  export type AttendeeUncheckedUpdateWithoutAllocationInput = {
    enrollmentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    course?: StringFieldUpdateOperationsInput | string
    school?: StringFieldUpdateOperationsInput | string
    degree?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    convocationEligible?: BoolFieldUpdateOperationsInput | boolean
    convocationRegistered?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    crr?: StringFieldUpdateOperationsInput | string
    enclosure?: StringFieldUpdateOperationsInput | string
    accountId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RowCreateWithoutEnclosureInput = {
    id?: string
    letter: string
    startSeat: number
    endSeat: number
    reserved?: string
  }

  export type RowUncheckedCreateWithoutEnclosureInput = {
    id?: string
    letter: string
    startSeat: number
    endSeat: number
    reserved?: string
  }

  export type RowCreateOrConnectWithoutEnclosureInput = {
    where: RowWhereUniqueInput
    create: XOR<RowCreateWithoutEnclosureInput, RowUncheckedCreateWithoutEnclosureInput>
  }

  export type RowCreateManyEnclosureInputEnvelope = {
    data: RowCreateManyEnclosureInput | RowCreateManyEnclosureInput[]
  }

  export type RowUpsertWithWhereUniqueWithoutEnclosureInput = {
    where: RowWhereUniqueInput
    update: XOR<RowUpdateWithoutEnclosureInput, RowUncheckedUpdateWithoutEnclosureInput>
    create: XOR<RowCreateWithoutEnclosureInput, RowUncheckedCreateWithoutEnclosureInput>
  }

  export type RowUpdateWithWhereUniqueWithoutEnclosureInput = {
    where: RowWhereUniqueInput
    data: XOR<RowUpdateWithoutEnclosureInput, RowUncheckedUpdateWithoutEnclosureInput>
  }

  export type RowUpdateManyWithWhereWithoutEnclosureInput = {
    where: RowScalarWhereInput
    data: XOR<RowUpdateManyMutationInput, RowUncheckedUpdateManyWithoutEnclosureInput>
  }

  export type RowScalarWhereInput = {
    AND?: RowScalarWhereInput | RowScalarWhereInput[]
    OR?: RowScalarWhereInput[]
    NOT?: RowScalarWhereInput | RowScalarWhereInput[]
    id?: StringFilter<"Row"> | string
    letter?: StringFilter<"Row"> | string
    startSeat?: IntFilter<"Row"> | number
    endSeat?: IntFilter<"Row"> | number
    reserved?: StringFilter<"Row"> | string
    enclosureId?: StringFilter<"Row"> | string
  }

  export type EnclosureCreateWithoutRowsInput = {
    id?: string
    letter: string
    allocatedFor: $Enums.EnclosureType
    entryDirection: $Enums.Direction
  }

  export type EnclosureUncheckedCreateWithoutRowsInput = {
    id?: string
    letter: string
    allocatedFor: $Enums.EnclosureType
    entryDirection: $Enums.Direction
  }

  export type EnclosureCreateOrConnectWithoutRowsInput = {
    where: EnclosureWhereUniqueInput
    create: XOR<EnclosureCreateWithoutRowsInput, EnclosureUncheckedCreateWithoutRowsInput>
  }

  export type EnclosureUpsertWithoutRowsInput = {
    update: XOR<EnclosureUpdateWithoutRowsInput, EnclosureUncheckedUpdateWithoutRowsInput>
    create: XOR<EnclosureCreateWithoutRowsInput, EnclosureUncheckedCreateWithoutRowsInput>
    where?: EnclosureWhereInput
  }

  export type EnclosureUpdateToOneWithWhereWithoutRowsInput = {
    where?: EnclosureWhereInput
    data: XOR<EnclosureUpdateWithoutRowsInput, EnclosureUncheckedUpdateWithoutRowsInput>
  }

  export type EnclosureUpdateWithoutRowsInput = {
    letter?: StringFieldUpdateOperationsInput | string
    allocatedFor?: EnumEnclosureTypeFieldUpdateOperationsInput | $Enums.EnclosureType
    entryDirection?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
  }

  export type EnclosureUncheckedUpdateWithoutRowsInput = {
    letter?: StringFieldUpdateOperationsInput | string
    allocatedFor?: EnumEnclosureTypeFieldUpdateOperationsInput | $Enums.EnclosureType
    entryDirection?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
  }

  export type AttendeeCreateManyAccountInput = {
    id?: string
    enrollmentId: string
    name: string
    course: string
    school: string
    degree: string
    email?: string | null
    phone?: string | null
    convocationEligible?: boolean
    convocationRegistered?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    crr: string
    enclosure: string
  }

  export type AttendeeUpdateWithoutAccountInput = {
    enrollmentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    course?: StringFieldUpdateOperationsInput | string
    school?: StringFieldUpdateOperationsInput | string
    degree?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    convocationEligible?: BoolFieldUpdateOperationsInput | boolean
    convocationRegistered?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    crr?: StringFieldUpdateOperationsInput | string
    enclosure?: StringFieldUpdateOperationsInput | string
    allocation?: SeatAllocationUpdateOneWithoutAttendeeNestedInput
  }

  export type AttendeeUncheckedUpdateWithoutAccountInput = {
    enrollmentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    course?: StringFieldUpdateOperationsInput | string
    school?: StringFieldUpdateOperationsInput | string
    degree?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    convocationEligible?: BoolFieldUpdateOperationsInput | boolean
    convocationRegistered?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    crr?: StringFieldUpdateOperationsInput | string
    enclosure?: StringFieldUpdateOperationsInput | string
    allocation?: SeatAllocationUncheckedUpdateOneWithoutAttendeeNestedInput
  }

  export type AttendeeUncheckedUpdateManyWithoutAccountInput = {
    enrollmentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    course?: StringFieldUpdateOperationsInput | string
    school?: StringFieldUpdateOperationsInput | string
    degree?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    convocationEligible?: BoolFieldUpdateOperationsInput | boolean
    convocationRegistered?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    crr?: StringFieldUpdateOperationsInput | string
    enclosure?: StringFieldUpdateOperationsInput | string
  }

  export type RowCreateManyEnclosureInput = {
    id?: string
    letter: string
    startSeat: number
    endSeat: number
    reserved?: string
  }

  export type RowUpdateWithoutEnclosureInput = {
    letter?: StringFieldUpdateOperationsInput | string
    startSeat?: IntFieldUpdateOperationsInput | number
    endSeat?: IntFieldUpdateOperationsInput | number
    reserved?: StringFieldUpdateOperationsInput | string
  }

  export type RowUncheckedUpdateWithoutEnclosureInput = {
    letter?: StringFieldUpdateOperationsInput | string
    startSeat?: IntFieldUpdateOperationsInput | number
    endSeat?: IntFieldUpdateOperationsInput | number
    reserved?: StringFieldUpdateOperationsInput | string
  }

  export type RowUncheckedUpdateManyWithoutEnclosureInput = {
    letter?: StringFieldUpdateOperationsInput | string
    startSeat?: IntFieldUpdateOperationsInput | number
    endSeat?: IntFieldUpdateOperationsInput | number
    reserved?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}