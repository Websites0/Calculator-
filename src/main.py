import argparse
from calculator import add, subtract, multiply, divide

def main():
    parser = argparse.ArgumentParser(description="A simple calculator.")
    parser.add_argument("operation", choices=["add", "subtract", "multiply", "divide"], help="The operation to perform.")
    parser.add_argument("x", type=float, help="The first number.")
    parser.add_argument("y", type=float, help="The second number.")
    args = parser.parse_args()

    if args.operation == "add":
        result = add(args.x, args.y)
    elif args.operation == "subtract":
        result = subtract(args.x, args.y)
    elif args.operation == "multiply":
        result = multiply(args.x, args.y)
    elif args.operation == "divide":
        try:
            result = divide(args.x, args.y)
        except ValueError as e:
            print(e)
            return

    print(f"The result is: {result}")

if __name__ == "__main__":
    main()
