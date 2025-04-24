import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AddExpenseModal from './AddExpenseModal'


describe('AddExpenseModal', () => {
  it('renders modal title', () => {
    render(<AddExpenseModal groupId=''  isOpen={true} onClose={() => {}} />)
    expect(screen.getByText(/add expense/i)).toBeInTheDocument()
  })
})
