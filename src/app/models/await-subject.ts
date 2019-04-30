import { INextValue } from './next-value.interface';
import { ISubscription } from './subscription.interface';

export type ObserverFunction<T> = (value: INextValue<T>) => Promise<void>;

export class AwaitSubject<T> {
  private _observers: Array<ObserverFunction<T>> = [];
  public subscribe(observer: ObserverFunction<T>): ISubscription {
    this._observers.push(observer);
    return {
      unsubscribe: () => {
        this._observers[this._observers.indexOf(observer)] = null;
      }
    };
  }

  public async next(value: INextValue<T>): Promise<void> {
    await Promise.all(this._observers.map(async (o): Promise<void> => {
      if (o != null) {
        await o(value);
      }
    }));
  }
}
