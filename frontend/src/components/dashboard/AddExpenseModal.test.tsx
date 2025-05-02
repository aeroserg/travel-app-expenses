import { render, screen } from '../../utils/testing/test-utils'
import '@testing-library/jest-dom'
import AddExpenseModal from './AddExpenseModal'


describe('AddExpenseModal', () => {
  it('renders modal title', () => {
    render(<AddExpenseModal groupId=''  isOpen={true} onClose={() => {}} />)
    expect(screen.getByText(/Добавить трату/i)).toBeInTheDocument()
  })
})
