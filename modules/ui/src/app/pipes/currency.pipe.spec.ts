import { CurrencyPipe } from './currency.pipe';

describe('CurrencyPipe', () => {
  let pipe: CurrencyPipe;

  beforeEach(() => {
    pipe = new CurrencyPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return formatted amount for INR currency', () => {
    const value = { amount: 1234.56, currency: 'INR' };
    expect(pipe.transform(value)).toBe('INR 1,234.56');
  });

  it('should return formatted amount for USD currency', () => {
    const value = { amount: 1234.56, currency: 'USD' };
    expect(pipe.transform(value)).toBe('USD 1,234.56');
  });

  it('should return an empty string if value is null', () => {
    expect(pipe.transform(null as any)).toBe('');
  });

  it('should return an empty string if value is undefined', () => {
    expect(pipe.transform(undefined as any)).toBe('');
  });

  it('should return an empty string if amount is NaN', () => {
    const value = { amount: NaN, currency: 'USD' };
    expect(pipe.transform(value)).toBe('');
  });

  it('should return an empty string if currency is an empty string', () => {
    const value = { amount: 1234.56, currency: '' };
    expect(pipe.transform(value)).toBe('');
  });

  it('should return an empty string if value is missing currency property', () => {
    const value = { amount: 1234.56 } as any;
    expect(pipe.transform(value)).toBe('');
  });

  it('should return an empty string if value is missing amount property', () => {
    const value = { currency: 'USD' } as any;
    expect(pipe.transform(value)).toBe('');
  });
});
