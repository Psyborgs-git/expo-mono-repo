describe('App', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle string operations', () => {
    const testString = 'Carat Central';
    expect(testString).toContain('Carat');
    expect(testString.length).toBeGreaterThan(0);
  });
});
