// Mock the default export 'api' (the axios instance) implicitly by mocking 'axios'
import api, { getTasks, getLists } from './api';

// Move mock definition INSIDE the factory or make it standalone local to factory
jest.mock('axios', () => {
    const mockApiClient = {
        get: jest.fn(),
        post: jest.fn(),
        patch: jest.fn(),
        interceptors: {
            request: { use: jest.fn() },
            response: { use: jest.fn() }
        }
    };
    return {
        create: jest.fn(() => mockApiClient),
        // Export the instance too if needed via a side channel? 
        // No, we can just call create() to get it since it returns a singleton here
    };
});

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store');
jest.mock('expo-constants', () => ({
    manifest: { extra: { API_URL: 'http://localhost:3000' } }
}), { virtual: true });

describe('API Service', () => {
    let mockApiClient;

    beforeEach(() => {
        // Retrieve the mocked instance used by api.js
        // getTasks calls api.get, so we need to spy on THAT instance
        mockApiClient = axios.create(); 
        jest.clearAllMocks();
    });

    describe('getTasks', () => {
        it('fetches tasks with default parameters', async () => {
            const mockData = { tasks: [], count: 0 };
            mockApiClient.get.mockResolvedValueOnce({ data: mockData });

            const result = await getTasks();

            expect(mockApiClient.get).toHaveBeenCalledWith(
                '/tasks?page=1&limit=10&sortBy=createdAt&sortDirection=desc'
            );
            expect(result).toEqual(mockData);
        });

        it('fetches tasks with list filter', async () => {
            const mockData = { tasks: [], count: 0 };
            mockApiClient.get.mockResolvedValueOnce({ data: mockData });

            const listId = '12345';
            await getTasks(1, 10, 'createdAt', 'desc', listId);

            expect(mockApiClient.get).toHaveBeenCalledWith(
                `/tasks/list/${listId}?page=1&limit=10&sortBy=createdAt&sortDirection=desc`
            );
        });
    });

    describe('getLists', () => {
        it('fetches lists successfully', async () => {
            const mockLists = [{ _id: '1', name: 'Personal' }];
            mockApiClient.get.mockResolvedValueOnce({ data: mockLists });

            const result = await getLists();

            expect(mockApiClient.get).toHaveBeenCalledWith('/lists');
            expect(result).toEqual(mockLists);
        });
    });
});
