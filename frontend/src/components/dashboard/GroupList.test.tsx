import { render, screen } from '@testing-library/react'
import GroupList from './GroupList'

describe('GroupList', () => {
  it('renders empty group list', () => {
    render(<GroupList groups={[]} isLoading={false} />)
    expect(screen.getByText(/no groups/i)).toBeInTheDocument()
  })
})
