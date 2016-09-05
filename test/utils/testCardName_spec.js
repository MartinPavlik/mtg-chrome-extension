import expect from 'expect'
import testCardName, { 
  splitIntoNameAndStatus 
} from '../../src/utils/testCardName.js'

describe('testCardName', () =>{
  it('should return true for the same names', () => {
    expect(testCardName('Cancel', 'Cancel')).toEqual(true)
  })
  it('should return false for different names', () => {
    expect(testCardName('Index', 'Cancel')).toEqual(false)
  })
  it('should return false when line has invalid prefix', () => {
    expect(testCardName('Reshape', 'Matter Reshaper')).toEqual(false)
  })
  it('should return false when line has invalid postfix', () => {
    expect(testCardName('Reshape', 'Reshaper')).toEqual(false)
  })
  it('should return false when line has invalid postfix', () => {
    expect(testCardName('Reshape', 'Reshape Flux')).toEqual(false)
  })
  it('should return true when valid line is given but ends with white spaces', () => {
    expect(testCardName('Reshape', 'Reshape          ')).toEqual(true)
  })
  it('should return true when valid line is given but starts with white spaces', () => {
    expect(testCardName('Reshape', '             Reshape')).toEqual(true)
  })
  it('should return true when name and version is given', () => {
    expect(testCardName('Arid Mesa', 'Arid Mesa (BFZ)')).toEqual(true)
  })
})

describe('splitIntoNameAndStatus', () => {
  it('should split into name and status', () => {
    expect(splitIntoNameAndStatus('Name - lightly played'), {
      name: 'Name',
      status: 'lightly played'
    })
  })
  it('should return input line as name when splitting is not possible', () => {
    expect(splitIntoNameAndStatus('Name-lightly played'), {
      name: 'Name-lightly played',
      status: undefined
    })
  })
})