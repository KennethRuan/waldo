import numpy as np

left_pupil_sizes = []
right_pupil_sizes = []

def pupilMaximum():
    max = 0
    maxIndex = 0
    for i in range(len(left_pupil_sizes)):
        if (left_pupil_sizes[i] + right_pupil_sizes[i] > max):
            max = left_pupil_sizes[i] + right_pupil_sizes[i]
            maxIndex = i
    return maxIndex
