import { type } from 'os'

type CalcRetirementIncomeDeductionInput = {
  yearsOfService: number
  isDisability: boolean
}

// 退職所得控除額
export const calcRetirementIncomeDeduction = ({
  yearsOfService,
  isDisability,
}: CalcRetirementIncomeDeductionInput) => {
  let deduction: number

  if (yearsOfService === 1) {
    deduction = 800_000
  } else if (yearsOfService <= 19) {
    deduction = 400_000 * yearsOfService
  } else {
    deduction = 8_000_000 + 700_000 * (yearsOfService - 20)
  }

  if (isDisability) {
    deduction += 1_000_000
  }

  return deduction
}

type CalcTaxableRetirementIncomeInput = {
  // 勤続年数
  yearsOfService: number
  // 退職金
  retirementIncome: number
  // 退職所得控除額
  retirementIncomeDeduction: number
  // 役員かどうか
  isExecutive: boolean
}

// 課税退職所得金額
export const calcTaxableRetirementIncome = ({
  yearsOfService,
  retirementIncome,
  retirementIncomeDeduction,
  isExecutive,
}: CalcTaxableRetirementIncomeInput) => {
  const targetIncome = retirementIncome - retirementIncomeDeduction

  if (targetIncome <= 0) {
    return 0
  }

  const calc = (): number => {
    if (yearsOfService >= 6) {
      return targetIncome / 2
    }

    if (isExecutive) {
      return targetIncome
    }

    if (targetIncome >= 3_000_000) {
      return targetIncome - 1_500_000
    }

    return targetIncome / 2
  }

  return Math.floor(calc() / 1000) * 1000
}

type CalcStandardIncomeTaxInput = {
  // 課税退職所得金額
  taxableRetirementIncome: number
}

// 基準所得税額
export const calcStandardIncomeTax = ({
  taxableRetirementIncome,
}: CalcStandardIncomeTaxInput) => {
  if (taxableRetirementIncome === 0) return 0

  const calc = (
    taxableRetirementIncome: number,
    taxRate: number,
    deduction: number,
  ): number => {
    return (taxableRetirementIncome * taxRate * 100) / 100 - deduction
  }

  if (taxableRetirementIncome <= 1_949_000) {
    return calc(taxableRetirementIncome, 0.05, 0)
  }

  if (taxableRetirementIncome <= 3_299_000) {
    return calc(taxableRetirementIncome, 0.1, 97_500)
  }

  if (taxableRetirementIncome <= 6_949_000) {
    return calc(taxableRetirementIncome, 0.2, 427_500)
  }

  if (taxableRetirementIncome <= 8_999_000) {
    return calc(taxableRetirementIncome, 0.23, 636_000)
  }

  if (taxableRetirementIncome <= 17_999_000) {
    return calc(taxableRetirementIncome, 0.33, 1_536_000)
  }

  if (taxableRetirementIncome <= 39_999_000) {
    return calc(taxableRetirementIncome, 0.4, 2_796_000)
  }

  return calc(taxableRetirementIncome, 0.45, 4_796_000)
}

type CalcIncomeTaxWithholdingInput = {
  // 基準所得税額
  standardIncomeTax: number
}

// 所得税の源泉徴収税額
export const calcIncomeTaxWithholding = ({
  standardIncomeTax,
}: CalcIncomeTaxWithholdingInput) => {
  return Math.floor((standardIncomeTax * 1021) / 1000)
}
