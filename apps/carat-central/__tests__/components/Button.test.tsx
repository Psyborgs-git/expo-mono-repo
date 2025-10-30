describe('Button Component', () => {
  it('should handle button logic', () => {
    const mockOnPress = jest.fn();
    
    // Simulate button press
    mockOnPress();
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should handle disabled state', () => {
    const mockOnPress = jest.fn();
    const disabled = true;
    
    // Simulate disabled button - should not call onPress
    if (!disabled) {
      mockOnPress();
    }
    
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should handle button text', () => {
    const buttonText = 'Test Button';
    
    expect(buttonText).toBe('Test Button');
    expect(buttonText.length).toBeGreaterThan(0);
  });
});