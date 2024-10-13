import { describe, it, expect, vi } from 'vitest';
import { getFirstAlbumTitle } from "./callBooks";

describe("App component", () => {
  it('should return the title of the first album', async () => {
    // Mock the fetch function using a spy
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      json: () => Promise.resolve([{ title: 'mocked album title' }]),
    } as Response);

    // Call the function
    const title = await getFirstAlbumTitle();

    // Verify the result
    expect(title).toBe('mocked album title');

    // Verify that fetch was called with the correct URL
    expect(fetchSpy).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/albums');

    // Restore the original fetch function
    fetchSpy.mockRestore();
  });
});