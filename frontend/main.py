import asyncio

import time


async def task1():
    print("Task 1 started")
    time.sleep(2)
    print("Task 1 completed")


async def task2():
    print("Task 2 started")
    await asyncio.sleep(3)
    print("Task 2 completed")


async def main():
    print("Main coroutine started")

    # Create tasks to run concurrently
    tasks = [task1(), task2()]

    # Wait for all tasks to complete
    await asyncio.gather(*tasks)

    print("Main coroutine completed")


# Run the event loop
asyncio.run(main())
