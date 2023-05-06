import { Router } from 'express'

import { calcIncomeTaxForSeverancePay } from './calcTax'

const router = Router()

router.post('/calc-tax', (req, res) => {
  const incomeTax = calcIncomeTaxForSeverancePay(req.body)
  res.json({ incomeTax })
})

export default router
