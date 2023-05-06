import { Router } from 'express'

import {
  calcIncomeTaxForSeverancePay,
  calcSeverancePayTaxInputSchema,
} from './calcTax'

const router = Router()

router.post('/calc-tax', (req, res) => {
  const validateResult = calcSeverancePayTaxInputSchema.safeParse(req.body)
  if (!validateResult.success) {
    res.status(400).json({ message: 'Invalid parameter.' })
    return
  }

  const incomeTax = calcIncomeTaxForSeverancePay(validateResult.data)
  res.json({ tax: incomeTax })
})

export default router
