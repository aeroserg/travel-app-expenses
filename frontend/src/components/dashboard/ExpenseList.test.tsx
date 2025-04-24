import { render, screen } from '@testing-library/react'
import ExpenseList from './ExpenseList'

describe('ExpenseList', () => {
  it('renders expense list', () => {
    render(<ExpenseList groupId='67ef83820fade67a5fcacd66' />)
    expect(screen.getByText(/no expenses/i)).toBeInTheDocument()
  })
})
