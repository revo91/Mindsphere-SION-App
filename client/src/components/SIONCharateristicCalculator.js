class SIONCharacteristicCalculator {
  constructor(
    degDelta = 0.36,
    movingAverageN = 10,
    endSpeedBackwardIndex = 10
  ) {
    if (!movingAverageN) throw new Error("movingAverageN should be defined");
    this._movingAverageN = movingAverageN;
    this._movingAverageBackward = Math.floor(movingAverageN / 2);
    this._movingAverageForward = movingAverageN - this._movingAverageBackward;
    this._endSpeedBackwardIndex = endSpeedBackwardIndex;

    this._times = [];
    this._values = [];
    this._loaded = false;
    this._degDelta = degDelta;
  }

  get times() {
    return this._times;
  }

  get movingAverageN() {
    return this._movingAverage;
  }

  get endSpeedBackwardIndex() {
    return this._endSpeedBackwardIndex;
  }

  get loaded() {
    return this._loaded;
  }

  get degDelta() {
    return this._degDelta;
  }

  get wasClosing() {
    return this._wasClosing;
  }

  load(jsonFilePayload) {
    if (!jsonFilePayload) throw new Error("jsonFilePayload should be defined");
    if (!jsonFilePayload._wasClosing === undefined)
      throw new Error("_wasClosing should be defined");
    if (!jsonFilePayload._timeValues)
      throw new Error("_timeValues should be defined");
    if (!jsonFilePayload._angleValues)
      throw new Error("_angleValues should be defined");

    this._times = jsonFilePayload._timeValues;
    this._values = jsonFilePayload._angleValues;
    this._wasClosing = jsonFilePayload._wasClosing;
    this._loaded = true;
  }

  doMoveAverageOnValues() {
    if (!this._loaded) throw new Error("Object is not loaded");

    this._values = this._values.map((value, index, array) =>
      SIONCharacteristicCalculator._movingAverage(
        array,
        index,
        this._movingAverageBackward,
        this._movingAverageForward
      )
    );
  }

  calculateParamters() {}

  _calculateEndValue() {
    if (!this._loaded) throw new Error("Object is not loaded");

    return this._values[this._values.length - 1];
  }

  _calculateEndIndex() {
    if (!this._loaded) throw new Error("Object is not loaded");

    let endValue = this._calculateEndValue();

    let lastIndex = this._values.length - 1;

    while (
      lastIndex > 0 &&
      Math.abs(this._values[lastIndex] - endValue) < this._degDelta
    ) {
      lastIndex--;
    }

    return lastIndex;
  }

  _calculateStartValue() {
    if (!this._loaded) throw new Error("Object is not loaded");

    return this._values[0];
  }

  _calculateStartIndex() {
    if (!this._loaded) throw new Error("Object is not loaded");

    let startValue = this._calculateStartValue();

    let startIndex = 0;

    while (
      startIndex < this._values.length &&
      Math.abs(this._values[startIndex] - startValue) < this._degDelta
    ) {
      startIndex++;
    }

    return startIndex;
  }

  _calculateOperationEndIndex() {
    if (!this._loaded) throw new Error("Object is not loaded");

    let endValue = this._calculateEndValue();

    let startIndex = 0;

    if (this._wasClosing) {
      while (
        startIndex < this._values.length &&
        this._values[startIndex] < endValue - this._degDelta
      ) {
        startIndex++;
      }
    } else {
      while (
        startIndex < this._values.length &&
        this._values[startIndex] > endValue + this._degDelta
      ) {
        startIndex++;
      }
    }

    return startIndex;
  }

  _calculatePeekIndex() {
    if (!this._loaded) throw new Error("Object is not loaded");

    if (this._wasClosing) {
      let maxIndex = 0,
        maxValue = this._values[0];

      for (let valueIndex in this._values) {
        if (this._values[valueIndex] > maxValue) {
          maxValue = this._values[valueIndex];
          maxIndex = valueIndex;
        }
      }

      return maxIndex;
    } else {
      let minIndex = 0,
        minValue = this._values[0];

      for (let valueIndex in this._values) {
        if (this._values[valueIndex] < minValue) {
          minValue = this._values[valueIndex];
          minIndex = valueIndex;
        }
      }
      return minIndex;
    }
  }

  _calculateReturnPeekIndex() {
    if (!this._loaded) throw new Error("Object is not loaded");
    if (this._wasClosing)
      throw new Error(
        "Calculating return peek cannot be performed on closing operation"
      );

    let operationEndIndex = this._calculateOperationEndIndex();

    let maxIndex = operationEndIndex,
      maxValue = this._values[operationEndIndex];

    for (let i = operationEndIndex; i < this._values.length; i++) {
      if (this._values[i] > maxValue) {
        maxValue = this._values[i];
        maxIndex = i;
      }
    }

    return maxIndex;
  }

  _calculateEndSpeedBeginIndex() {
    if (!this._loaded) throw new Error("Object is not loaded");

    let endSpeedIndex = this._calculateOperationEndIndex();
    let endSpeedValue = this._values[endSpeedIndex];
    let endSpeedBeginIndex = endSpeedIndex - this._endSpeedBackwardIndex;
    if (endSpeedBeginIndex < 0) endSpeedBeginIndex = 0;
    let endSpeedBeginValue = this._values[endSpeedBeginIndex];

    while (endSpeedBeginIndex > 0 && endSpeedBeginValue === endSpeedValue) {
      endSpeedBeginIndex--;
      endSpeedBeginValue = this._values[endSpeedBeginIndex];
    }

    return endSpeedBeginIndex;
  }

  getData() {
    if (!this._loaded) throw new Error("Object is not loaded");

    let endIndex = this._calculateEndIndex();
    let startIndex = this._calculateStartIndex();
    let operationEndIndex = this._calculateOperationEndIndex();
    let peekIndex = this._calculatePeekIndex();
    let endSpeedBeginIndex = this._calculateEndSpeedBeginIndex();

    let speed = Math.abs(
      (this._values[operationEndIndex] - this._values[startIndex]) /
        (1000 * this._times[operationEndIndex] - 1000 * this._times[startIndex])
    );

    let peek = Math.abs(this._values[peekIndex] - this._values[endIndex]);

    let delta = Math.abs(
      this._values[this._values.length - 1] - this._values[0]
    );

    let restTime = Math.abs(
      1000 * this._times[operationEndIndex] - 1000 * this._times[endIndex]
    );

    let result = {
      speed: speed,
      peek: peek,
      delta: delta,
      restTime: restTime
    };

    if (endSpeedBeginIndex !== 0) {
      let endSpeed = Math.abs(
        (this._values[operationEndIndex] - this._values[endSpeedBeginIndex]) /
          (1000 * this._times[operationEndIndex] -
            1000 * this._times[endSpeedBeginIndex])
      );
      result.endSpeed = endSpeed;
    }

    if (!this._wasClosing) {
      let returnPeekIndex = this._calculateReturnPeekIndex();

      let returnPeek = Math.abs(
        this._values[returnPeekIndex] - this._values[this._values.length - 1]
      );
      result.returnPeek = returnPeek;
    }

    return result;
  }

  static _movingAverage(array, index, backwardN, forwardN) {
    if (index < backwardN) return array[index];
    if (index > array.length - forwardN) return array[index];
    let startIndex = index - backwardN;
    let stopIndex = index + forwardN;
    let totalCount = backwardN + forwardN;
    let totalSum = 0;

    for (let i = startIndex; i < stopIndex; i++) {
      totalSum += array[i];
    }

    return totalSum / totalCount;
  }
}

export default SIONCharacteristicCalculator;
