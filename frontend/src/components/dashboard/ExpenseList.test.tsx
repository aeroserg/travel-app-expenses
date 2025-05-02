import { render, screen, waitFor } from '../../utils/testing/test-utils'
import ExpenseList from './ExpenseList';

beforeEach(() => {
  Storage.prototype.getItem = jest.fn(() => 'mocked-token');

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([]),
    }),
  ) as jest.Mock;
});

describe('ExpenseList', () => {
  it('renders empty expense list', async () => {
    render(<ExpenseList groupId='67ef83820fade67a5fcacd66' />);

    await waitFor(() => {
      expect(screen.getByText(/Нет трат/i)).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Auth-Token': 'mocked-token', // <-- используем верный заголовок
        }),
      }),
    );
  });
});
