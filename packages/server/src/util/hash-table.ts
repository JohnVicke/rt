class Node<TValue = any> {
  key: PropertyKey;
  value: TValue;
  next: Node | null;
  prev: Node | null;

  constructor(key: PropertyKey, value: TValue) {
    this.key = key;
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

export class HashTable {
  private buckets: Array<Node | null> = [];
  private size = 0;
  private capacity: number;

  constructor(initialCapacity = 11) {
    this.capacity = initialCapacity;
    this.buckets = new Array(initialCapacity);
  }

  insert(key: PropertyKey, value: any) {
    const index = this.hash(key);
    const newNode = new Node(key, value);

    if (!this.buckets[index]) {
      this.buckets[index] = newNode;
    } else {
      newNode.next = this.buckets[index];
      if (this.buckets[index]) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        this.buckets[index]!.prev = newNode;
      }
      this.buckets[index] = newNode;
    }

    this.size++;

    // Check if resizing is needed
    if (this.size >= this.capacity * 0.7) {
      this.resize(this.capacity * 2);
    }
  }

  find(key: PropertyKey) {
    const index = this.hash(key);
    let currentNode = this.buckets[index];
    while (currentNode) {
      if (currentNode.key === key) {
        return currentNode.value;
      }
      currentNode = currentNode.next as Node;
    }
  }

  delete(key: PropertyKey) {
    const index = this.hash(key);
    let currentNode = this.buckets[index];
    while (currentNode) {
      if (currentNode.key === key) {
        if (currentNode.prev) {
          currentNode.prev.next = currentNode.next;
        } else {
          this.buckets[index] = currentNode.next;
        }
        if (currentNode.next) {
          currentNode.next.prev = currentNode.prev;
        }
        this.size--;

        if (this.size <= this.capacity * 0.2) {
          this.resize(Math.max(Math.floor(this.capacity / 2), 1));
        }

        return true;
      }
      currentNode = currentNode.next;
    }
    return false;
  }

  private hash(key: PropertyKey) {
    return key.toString().length % this.capacity;
  }

  private resize(newCapacity: number) {
    const newBuckets = new Array(newCapacity);
    this.capacity = newCapacity;
    this.size = 0;

    for (const bucket of this.buckets) {
      let currentNode = bucket;
      while (currentNode) {
        const index = this.hash(currentNode.key);
        const newNode = new Node(currentNode.key, currentNode.value);
        if (!newBuckets[index]) {
          newBuckets[index] = newNode;
        } else {
          newNode.next = newBuckets[index];
          newBuckets[index].prev = newNode;
          newBuckets[index] = newNode;
        }
        this.size++;
        currentNode = currentNode.next as Node;
      }
    }
    this.buckets = newBuckets;
  }

  get length() {
    return this.buckets.length;
  }

  logTable() {
    if (this.size === 0) {
      console.log("HashTable is empty.");
      return;
    }

    const table = this.buckets
      .map((bucket, i) => ({ ...bucket, idx: i }))
      .filter((bucket) => bucket.key !== null);

    console.log("HashTable Content:");
    console.table(table);
  }
}
