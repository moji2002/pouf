import { describe, expect, test } from 'bun:test'
import { normalizeOnBlur, sanitizeNumeric, stepValue } from '../registry/pouf/numberinput-math'

/** The three pure halves of the pouf NumberInput (spinbutton). Everything
 * string-in/string-out: the component keeps the user's typing verbatim,
 * so partial states ("1.", "-") must survive sanitising and stepping must
 * never smuggle float noise ("1.6000000000000001") into the field. */

describe('sanitizeNumeric', () => {
  test('passes clean decimals through', () => {
    expect(sanitizeNumeric('12.5')).toBe('12.5')
  })
  test('strips letters and symbols', () => {
    expect(sanitizeNumeric('1a2b%')).toBe('12')
  })
  test('keeps a minus only in front', () => {
    expect(sanitizeNumeric('-5')).toBe('-5')
    expect(sanitizeNumeric('5-3')).toBe('53')
    expect(sanitizeNumeric('--2')).toBe('-2')
  })
  test('keeps only the first dot', () => {
    expect(sanitizeNumeric('1.2.3')).toBe('1.23')
  })
  test('allows partial states while typing', () => {
    expect(sanitizeNumeric('-')).toBe('-')
    expect(sanitizeNumeric('1.')).toBe('1.')
    expect(sanitizeNumeric('.')).toBe('.')
  })
})

describe('stepValue', () => {
  test('adds and subtracts the step', () => {
    expect(stepValue('2', 1, { step: 1 })).toBe('3')
    expect(stepValue('2', -1, { step: 1 })).toBe('1')
  })
  test('never emits float noise: 1.5 + 0.1 is 1.6', () => {
    expect(stepValue('1.5', 1, { step: 0.1 })).toBe('1.6')
  })
  test('keeps the finer of value/step precision', () => {
    expect(stepValue('1.55', 1, { step: 0.1 })).toBe('1.65')
  })
  test('clamps at max and min', () => {
    expect(stepValue('9.95', 1, { step: 0.1, max: 10 })).toBe('10')
    expect(stepValue('0.05', -1, { step: 0.1, min: 0 })).toBe('0')
  })
  test('starts from min ?? 0 when empty or unparseable', () => {
    expect(stepValue('', 1, { step: 1 })).toBe('0')
    expect(stepValue('', 1, { step: 1, min: 5 })).toBe('5')
    expect(stepValue('-', 1, { step: 1 })).toBe('0')
  })
  test('parses partial decimals', () => {
    expect(stepValue('1.', 1, { step: 1 })).toBe('2')
  })
  test('mult scales the step without losing precision', () => {
    // 10 × 0.07 is 0.7000000000000001 in floats; the result must still be clean.
    expect(stepValue('0.7', 1, { step: 0.07, mult: 10 })).toBe('1.4')
  })
  test('never emits negative zero', () => {
    // 0.3 − 3×0.1 is -5.55e-17; toFixed would print "-0.0".
    expect(stepValue('0.3', -1, { step: 0.1, mult: 3 })).toBe('0')
  })
})

describe('normalizeOnBlur', () => {
  test('trims a trailing dot', () => {
    expect(normalizeOnBlur('1.', {})).toBe('1')
  })
  test('empties unparseable leftovers', () => {
    expect(normalizeOnBlur('-', {})).toBe('')
    expect(normalizeOnBlur('.', {})).toBe('')
    expect(normalizeOnBlur('', {})).toBe('')
  })
  test('clamps into range', () => {
    expect(normalizeOnBlur('-5', { min: 0 })).toBe('0')
    expect(normalizeOnBlur('99', { max: 10 })).toBe('10')
  })
  test('canonicalizes without changing the number', () => {
    expect(normalizeOnBlur('007', {})).toBe('7')
    expect(normalizeOnBlur('.5', {})).toBe('0.5')
  })
})
