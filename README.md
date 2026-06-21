# GroupingGame

## Overview

**Best Group** is a puzzle game where players organize workers into groups based on hidden personality types.

Each worker belongs to one of three personality types, but their personalities are invisible. Your goal is to infer these types by observing the score obtained from different groupings.

Be careful—one worker is a **spy**. Any group containing the spy scores **0 points**.

---

## Features

* Drag and drop to create groups
* Move group circles freely
* Automatically calculate scores
* Hidden information deduction puzzle
* Multiple difficulty levels
* Score history table
* Secret difficulty unlock

---

## How to Play

1. Select a difficulty and start the game.
2. Drag **"Create Group"** onto the field to create a new group.
3. Move the circles so workers are inside or outside each group.
4. Press **Execute** to calculate the day's score.
5. Repeat until all turns are used.
6. At the end of the game, the workers' personality types are revealed.

---

## Rules

* Every worker belongs to one of **three personality types**.
* Personality types cannot be identified by appearance.
* One worker is a **spy**.
* Any group containing the spy receives **0 points**.
* Workers outside every group do not affect the score.

The score for each group is calculated as

```text
2^(largest number of workers sharing the same personality − 1)
```

If the group contains no workers, its score is **0**.

The final score for a day is the sum of all group scores.

---

## Controls

| Action              | Description           |
| ------------------- | --------------------- |
| Drag "Create Group" | Create a new group    |
| Drag a group        | Move the group        |
| Drag a worker       | Move a worker         |
| Right-click a group | Delete the group      |
| Execute             | Calculate the score   |
| Show Table          | Display score history |

---

## Difficulty Levels

| Difficulty | Workers | Turns |
| ---------- | ------: | ----: |
| Easy       |       6 |     7 |
| Normal     |       8 |    10 |
| Hard       |      10 |    15 |
| Hidden     |      15 |    20 |

---

## Technologies

* HTML
* CSS
* JavaScript
* SVG

---

## Implementation

This project was implemented using object-oriented JavaScript.

Main classes include:

* `GameMap`
* `Human`
* `GroupCircle`

Major features:

* SVG-based rendering
* Drag-and-drop interaction
* Collision detection using circle distance
* Automatic score calculation
* Dynamic table generation
* Difficulty selection using URL parameters

---

## Project Structure

```text
GroupingGame/
├── index.html
├── CSS/
├── Js/
├── img/
└── README.md
```

---

## Future Improvements

* Additional game modes
* Random stage generation
* Improved UI animations
