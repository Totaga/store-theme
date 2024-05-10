import math

def calculate_sell_price(unit_price, unit_cost, max_quantity, min_margin, start_margin):
    # Calculate the minimum sell price based on the minimum margin
    min_sell_price = unit_cost * (1 + min_margin / 100)
    # Calculate the starting sell price based on the starting margin
    start_sell_price = unit_price * (1 + start_margin / 100)
    
    # Results dictionary to store quantity and corresponding sell price
    results = {}

    # Calculate sell prices for each quantity from 1 to max_quantity
    for quantity in range(1, max_quantity + 1):
        # Calculate the discount dynamically using a logarithmic approach
        if quantity == 1:
            discount_applied = 0  # No discount for the first item
        else:
            discount_applied = 1 - (1 / math.log(quantity + 1))
        
        # Calculate discounted price
        discounted_price = unit_price * (1 - discount_applied)
        
        # Ensure the sell price is not below the minimum margin threshold
        final_sell_price = max(discounted_price, min_sell_price)

        # Adjust to nearest .99
        if final_sell_price % 1 >= 0.99:
            final_sell_price = int(final_sell_price) + 0.99
        else:
            final_sell_price = int(final_sell_price) - 0.01 + 0.99
        
        # Store the results
        results[quantity] = final_sell_price
    
    # Print the results
    for quantity, price in results.items():
        print(f"Quantity: {quantity}, Sell Price: {price:.2f}")

# Example usage:
unit_price = 100  # Example unit price
unit_cost = 70    # Example unit cost
max_quantity = 100  # Max quantity to calculate
min_margin = 10    # Minimum margin percentage
start_margin = 20  # Starting margin percentage

calculate_sell_price(unit_price, unit_cost, max_quantity, min_margin, start_margin)
