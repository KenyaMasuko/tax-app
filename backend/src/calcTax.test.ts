import {
  calcRetirementIncomeDeduction,
  calcTaxableRetirementIncome,
} from './calcTax'

describe('退職所得控除額', () => {
  describe('勤続年数が1年の場合', () => {
    describe('「障害者となったことに直接起因して退職」に該当しない場合', () => {
      test.each`
        yearsOfService | expected
        ${1}           | ${800_000}
      `(
        '勤続年数$yearsOfService年 → $expected円',
        ({ yearsOfService, expected }) => {
          const deduction = calcRetirementIncomeDeduction({
            yearsOfService,
            isDisability: false,
          })
          expect(deduction).toBe(expected)
        },
      )
    })
    describe('「障害者となったことに直接起因して退職」に該当する場合', () => {
      test.each`
        yearsOfService | expected
        ${1}           | ${1_800_000}
      `(
        '勤続年数$yearsOfService年 → $expected円',
        ({ yearsOfService, expected }) => {
          const deduction = calcRetirementIncomeDeduction({
            yearsOfService,
            isDisability: true,
          })
          expect(deduction).toBe(expected)
        },
      )
    })
  })
  describe('勤続年数が2年から19年の場合', () => {
    describe('「障害者となったことに直接起因して退職」に該当しない場合', () => {
      test.each`
        yearsOfService | expected
        ${2}           | ${800_000}
        ${3}           | ${1_200_000}
        ${19}          | ${7_600_000}
      `(
        '勤続年数$yearsOfService年 → $expected円',
        ({ yearsOfService, expected }) => {
          const deduction = calcRetirementIncomeDeduction({
            yearsOfService,
            isDisability: false,
          })
          expect(deduction).toBe(expected)
        },
      )
    })
    describe('「障害者となったことに直接起因して退職」に該当する場合', () => {
      test.each`
        yearsOfService | expected
        ${2}           | ${1_800_000}
        ${3}           | ${2_200_000}
        ${19}          | ${8_600_000}
      `(
        '勤続年数$yearsOfService年 → $expected円',
        ({ yearsOfService, expected }) => {
          const deduction = calcRetirementIncomeDeduction({
            yearsOfService,
            isDisability: true,
          })
          expect(deduction).toBe(expected)
        },
      )
    })
  })

  describe('勤続年数が20年超の場合', () => {
    describe('「障害者となったことに直接起因して退職」に該当しない場合', () => {
      test.each`
        yearsOfService | expected
        ${20}          | ${8_000_000}
        ${21}          | ${8_700_000}
        ${30}          | ${15_000_000}
      `(
        '勤続年数$yearsOfService年 → $expected円',
        ({ yearsOfService, expected }) => {
          const deduction = calcRetirementIncomeDeduction({
            yearsOfService,
            isDisability: false,
          })
          expect(deduction).toBe(expected)
        },
      )
    })
    describe('「障害者となったことに直接起因して退職」に該当する場合', () => {
      test.each`
        yearsOfService | expected
        ${20}          | ${9_000_000}
        ${21}          | ${9_700_000}
        ${30}          | ${16_000_000}
      `(
        '勤続年数$yearsOfService年 → $expected円',
        ({ yearsOfService, expected }) => {
          const deduction = calcRetirementIncomeDeduction({
            yearsOfService,
            isDisability: true,
          })
          expect(deduction).toBe(expected)
        },
      )
    })
  })
})

describe('課税退職所得金額', () => {
  describe('勤続年数が6年以上の場合', () => {
    test.each`
      yearsOfService | retirementIncome | retirementIncomeDeduction | isExecutive | expected
      ${6}           | ${3_000_000}     | ${2_400_000}              | ${false}    | ${300_000}
      ${6}           | ${3_000_000}     | ${2_400_000}              | ${true}     | ${300_000}
      ${6}           | ${3_001_999}     | ${2_400_000}              | ${false}    | ${300_000}
      ${6}           | ${3_001_999}     | ${2_400_000}              | ${true}     | ${300_000}
      ${6}           | ${3_002_000}     | ${2_400_000}              | ${false}    | ${301_000}
      ${6}           | ${3_002_000}     | ${2_400_000}              | ${true}     | ${301_000}
      ${6}           | ${1_000_000}     | ${2_400_000}              | ${false}    | ${0}
      ${6}           | ${1_000_000}     | ${2_400_000}              | ${true}     | ${0}
    `(
      '勤続年数$yearsOfService年・退職金$retirementIncome・退職所得控除額$retirementIncomeDeduction・役員$isExecutive',
      ({
        yearsOfService,
        retirementIncome,
        retirementIncomeDeduction,
        isExecutive,
        expected,
      }) => {
        const deduction = calcTaxableRetirementIncome({
          yearsOfService,
          retirementIncome,
          retirementIncomeDeduction,
          isExecutive,
        })

        expect(deduction).toBe(expected)
      },
    )
  })
  describe('役員等で勤続年数が5年以下の場合', () => {
    test.each`
      yearsOfService | retirementIncome | retirementIncomeDeduction | expected
      ${5}           | ${3_000_000}     | ${2_000_000}              | ${1_000_000}
      ${5}           | ${3_000_999}     | ${2_000_000}              | ${1_000_000}
      ${5}           | ${3_001_000}     | ${2_000_000}              | ${1_001_000}
      ${5}           | ${1_000_000}     | ${2_000_000}              | ${0}
    `(
      '勤続年数$yearsOfService年・退職金$retirementIncome・退職所得控除額$retirementIncomeDeduction・役員$isExecutive',
      ({
        yearsOfService,
        retirementIncome,
        retirementIncomeDeduction,
        expected,
      }) => {
        const deduction = calcTaxableRetirementIncome({
          yearsOfService,
          retirementIncome,
          retirementIncomeDeduction,
          isExecutive: true,
        })

        expect(deduction).toBe(expected)
      },
    )
  })
  describe('役員等以外で勤続年数が5年以下の場合', () => {
    describe('控除額が300万円以下の場合', () => {
      test.each`
        yearsOfService | retirementIncome | retirementIncomeDeduction | expected
        ${5}           | ${3_000_000}     | ${2_000_000}              | ${500_000}
        ${5}           | ${5_000_000}     | ${2_000_000}              | ${1_500_000}
        ${5}           | ${3_001_999}     | ${2_000_000}              | ${500_000}
        ${5}           | ${3_002_000}     | ${2_000_000}              | ${501_000}
        ${5}           | ${1_000_000}     | ${2_000_000}              | ${0}
      `(
        '勤続年数$yearsOfService年・退職金$retirementIncome・退職所得控除額$retirementIncomeDeduction・役員$isExecutive',
        ({
          yearsOfService,
          retirementIncome,
          retirementIncomeDeduction,
          expected,
        }) => {
          const deduction = calcTaxableRetirementIncome({
            yearsOfService,
            retirementIncome,
            retirementIncomeDeduction,
            isExecutive: false,
          })

          expect(deduction).toBe(expected)
        },
      )
    })
    describe('控除額が300万円を超える場合', () => {
      test.each`
        yearsOfService | retirementIncome | retirementIncomeDeduction | expected
        ${5}           | ${6_000_000}     | ${2_000_000}              | ${2_500_000}
        ${5}           | ${6_001_999}     | ${2_000_000}              | ${2_501_000}
        ${5}           | ${6_002_000}     | ${2_000_000}              | ${2_502_000}
      `(
        '勤続年数$yearsOfService年・退職金$retirementIncome・退職所得控除額$retirementIncomeDeduction・役員$isExecutive',
        ({
          yearsOfService,
          retirementIncome,
          retirementIncomeDeduction,
          expected,
        }) => {
          const deduction = calcTaxableRetirementIncome({
            yearsOfService,
            retirementIncome,
            retirementIncomeDeduction,
            isExecutive: false,
          })

          expect(deduction).toBe(expected)
        },
      )
    })
  })
})
