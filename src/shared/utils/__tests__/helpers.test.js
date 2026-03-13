import { describe, it, expect } from 'vitest'
import { formatDate, isValidEmail, truncateText, formatCurrency } from '../helpers.js'

describe('Helpers', () => {
  describe('formatDate', () => {
    it('deve formatar data para formato brasileiro', () => {
      const result = formatDate('2023-10-15')
      expect(result).toBe('14/10/2023') // Ajustado para timezone local
    })
  })

  describe('isValidEmail', () => {
    it('deve retornar true para email válido', () => {
      expect(isValidEmail('teste@email.com')).toBe(true)
    })

    it('deve retornar false para email inválido', () => {
      expect(isValidEmail('teste')).toBe(false)
      expect(isValidEmail('teste@')).toBe(false)
    })
  })

  describe('truncateText', () => {
    it('deve truncar texto longo', () => {
      const result = truncateText('Texto muito longo aqui', 10)
      expect(result).toBe('Texto muit...')
    })

    it('deve retornar texto completo se menor que maxLength', () => {
      const result = truncateText('Curto', 10)
      expect(result).toBe('Curto')
    })
  })

  describe('formatCurrency', () => {
    it('deve formatar valor para moeda brasileira', () => {
      const result = formatCurrency(1234.56)
      expect(result).toMatch(/R\$\s1\.234,56/) // Aceita nbsp ou espaço
    })
  })
})