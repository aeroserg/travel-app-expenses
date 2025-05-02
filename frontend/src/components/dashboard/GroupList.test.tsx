import { render, screen } from '../../utils/testing/test-utils'
import GroupList from './GroupList'

describe('GroupList', () => {
  it('renders empty group list', () => {
    render(<GroupList groups={[]} isLoading={false} />)
    expect(screen.getByText(/Вы не состоите ни в одной группе/i)).toBeInTheDocument()
  })
})
