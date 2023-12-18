import { camelToKabab, classNames, clsNms } from '../src/utils'

describe('camel-to-kabab', () => {
  test('input:camel, output:kabab', () => {
    expect(camelToKabab('helloWorld')).toEqual('hello-world')
    expect(camelToKabab('camel2Kabab')).toEqual('camel2-kabab')
    expect(camelToKabab('koreaArmyTrainingCenterK2')).toEqual(
      'korea-army-training-center-k2',
    )
  })
  test('if input value is not camelcase then return no change', () => {
    expect(camelToKabab('hello-world')).toEqual('hello-world')
    expect(camelToKabab('hello_world')).toEqual('hello_world')
    expect(camelToKabab('hello-World')).toEqual('hello-World')
  })
})

describe('class-names', () => {
  test('조건에 따라 클레스 문지열을 생성한다.', () => {
    expect(classNames({ a: true, b: false })).toEqual('a')
    expect(classNames({ a: true, b: false }, { c: true, d: true })).toEqual(
      'a c d',
    )
    expect(classNames('aa', 'bb')).toEqual('aa bb')
    expect(classNames('aa bb', 'cc')).toEqual('aa bb cc')
    expect(classNames('aa bb', 'cc', 'dd ee')).toEqual('aa bb cc dd ee')
    expect(classNames('aa', undefined, 'cc')).toEqual('aa cc')
    expect(classNames('aa', null, 'cc')).toEqual('aa cc')

    expect(classNames('cc', { a: true, b: false })).toEqual('cc a')
    expect(classNames('xx', { a: true, b: false }, 'vv')).toEqual('xx a vv')
    expect(classNames({ a: false, b: false })).toEqual(undefined)
  })
})

describe('clsNms', () => {
  test('working similar class-names', () => {
    expect(clsNms({ a: true, b: false })).toEqual('a')
    expect(clsNms({ a: true, b: false }, { c: true, d: true })).toEqual('a c d')
    expect(clsNms('aa', 'bb')).toEqual('aa bb')
    expect(clsNms('aa', undefined, 'cc')).toEqual('aa cc')
    expect(clsNms('aa', null, 'cc')).toEqual('aa cc')

    expect(clsNms('cc', { a: true, b: false })).toEqual('cc a')
    expect(clsNms('xx', { a: true, b: false }, 'vv')).toEqual('xx a vv')
    expect(clsNms({ a: false, b: false })).toEqual(undefined)
  })
  test('use kabab case', () => {
    expect(clsNms('visible', { hasContent: true })).toEqual(
      'visible has-content',
    )
    expect(clsNms('hasContent', { visible: true })).toEqual(
      'has-content visible',
    )
  })
})
