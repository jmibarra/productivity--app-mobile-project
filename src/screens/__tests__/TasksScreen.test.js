import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TasksScreen from '../TasksScreen';
import { AuthContext } from '../../context/AuthContext';
import * as api from '../../services/api';

// Mock dependencies
jest.mock('../../services/api');
jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons'
}), { virtual: true });

jest.mock('@react-navigation/native', () => {
    const actual = jest.requireActual('@react-navigation/native');
    return {
        ...actual,
        useNavigation: () => ({
            navigate: jest.fn(),
        }),
        useFocusEffect: jest.fn(),
    };
});

const mockNavigation = {
    navigate: jest.fn()
};

const mockTasks = [
    { _id: '1', title: 'Task 1', completed: false, list: 'default', priority: 1, createdAt: new Date().toISOString() },
    { _id: '2', title: 'Task 2', completed: true, list: 'work', priority: 2, createdAt: new Date().toISOString() }
];

const mockLists = [
    { _id: 'default', name: 'Personal' },
    { _id: 'work', name: 'Work' }
];

describe('TasksScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Setup default mocks
        api.getTasks.mockResolvedValue({ tasks: mockTasks, count: 2 });
        api.getLists.mockResolvedValue(mockLists);
    });

    const renderWithContext = () => {
        return render(
            <AuthContext.Provider value={{ userInfo: { name: 'Test User' } }}>
                <TasksScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        );
    };

    it('renders tasks and lists correctly', async () => {
        const { getByText } = renderWithContext();

        // Wait for loading to finish
        await waitFor(() => {
            expect(getByText('Task 1')).toBeTruthy();
            expect(getByText('Task 2')).toBeTruthy();
        });

        // Check list chips
        expect(getByText('Todos')).toBeTruthy();
        expect(getByText('Personal')).toBeTruthy();
        expect(getByText('Work')).toBeTruthy();
    });

    it('filters tasks when a list is selected', async () => {
        const { getByText } = renderWithContext();

        await waitFor(() => getByText('Task 1'));

        // Press 'Work' list
        const workChip = getByText('Work');
        fireEvent.press(workChip);

        // Verify API was called with filtered ID
        await waitFor(() => {
            expect(api.getTasks).toHaveBeenCalledWith(1, 10, 'createdAt', 'desc', 'work');
        });
    });
});
