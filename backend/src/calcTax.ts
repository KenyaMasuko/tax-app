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
