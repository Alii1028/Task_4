import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';

import AllPerks from '../src/pages/AllPerks.jsx';
import { renderWithRouter } from './utils/renderWithRouter.js';


  

describe('AllPerks page (Directory)', () => {
  test('lists public perks and responds to name filtering', async () => {
    // The seeded record gives us a deterministic expectation regardless of the
    // rest of the shared database contents.
    const seededPerk = global.__TEST_CONTEXT__.seededPerk;

    // Render the exploration page so it performs its real HTTP fetch.
    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );

    // Wait for the baseline card to appear which guarantees the asynchronous
    // fetch finished.
    await waitFor(() => {
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
    });

    // Interact with the name filter input using the real value that
    // corresponds to the seeded record.
    const nameFilter = screen.getByPlaceholderText('Enter perk name...');
    fireEvent.change(nameFilter, { target: { value: seededPerk.title } });

    await waitFor(() => {
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
    });

    // The summary text should continue to reflect the number of matching perks.
    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing');
  });

  /*
  TODO: Test merchant filtering
  - use the seeded record
  - perform a real HTTP fetch.
  - wait for the fetch to finish
  - choose the record's merchant from the dropdown
  - verify the record is displayed
  - verify the summary text reflects the number of matching perks
  */

  test('lists public perks and responds to merchant filtering', async () => {
    // The seeded record gives us a deterministic expectation regardless of the
    // rest of the shared database contents.
    const seededPerk = global.__TEST_CONTEXT__.seededPerk;

    // Render the exploration page so it performs its real HTTP fetch.
    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );

    // Wait for the baseline card to appear which guarantees the asynchronous
    // fetch finished.
    await waitFor(() => {
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
    });

    // Find the merchant filter dropdown and select the seeded perk's merchant
    // Wait for the merchants to be populated (the option should be available)
    let merchantFilter;
    await waitFor(() => {
      // Find the label first, then get the select element from the same container
      const label = screen.getByText(/filter by merchant/i);
      const container = label.closest('div');
      merchantFilter = container.querySelector('select');
      expect(merchantFilter).toBeTruthy();
      // Verify the merchant option is available in the dropdown
      const options = Array.from(merchantFilter.options).map(opt => opt.value);
      expect(options).toContain(seededPerk.merchant);
    });
    
    // Change the merchant filter value
    fireEvent.change(merchantFilter, { target: { value: seededPerk.merchant } });

    // Wait for the perk to still be displayed after filtering
    // The component has a 500ms debounce, so we need to wait for the filter to apply
    await waitFor(() => {
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
    }, { timeout: 3000 });

    // The summary text should reflect the number of matching perks
    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing');
  });
});
